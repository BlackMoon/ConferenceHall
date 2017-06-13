﻿import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConfirmationService, SelectItem, TreeNode } from 'primeng/primeng';
import { OrganizationNode } from "../../models";
import { OrganizationService } from "./organization.service";

const minChars = 3;

enum SearchKind { SearchOrg, SearchEmployee };

@Component({
    templateUrl: "organization-tree.component.html"
})
export class OrganizationTreeComponent implements OnInit {

    editMode: boolean;
    filter: string;

    /**
     * Поиск по сотрудникам/организациям
     */
    emplSearch: boolean;

    nodes: TreeNode[] = [];
    selectedNodes: TreeNode[] = [];

    searchTitle: string = "По организациям";

    constructor(
        private confirmationService: ConfirmationService,
        private organizationService: OrganizationService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {
        this.loadOrganizations();
    }

    addEmployee = () => this.router.navigate(["emploees/new"]);

    addOrganization = () => this.router.navigate(["orgs/new"]);

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedNodes.length = 0;
    }
    

    filterChange(value) {

        this.filter = value;
        if (value.length >= minChars || !value.length)
            this.loadOrganizations();
    }

    /**
     * Handle enter key press
     */
    filterKeyPressed(event) {

        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    loadNode(e) {
        
        if (e.node && !e.node.hasOwnProperty("children")) {
            let id = e.node.data["id"];

            this.organizationService
                .getAll(this.emplSearch, id, this.filter)
                .subscribe(
                    nodes => {
                        e.node.children = nodes;

                        // node selected ?
                        let ix = this.selectedNodes.findIndex(n => n.data["id"] === id);                
                        (ix !== -1) && (this.selectedNodes = this.selectedNodes.concat(nodes));
                    },
                    error => this.logger.error2(error));

            
        }
    }

    loadOrganizations() {

        this.organizationService
            .getAll(this.emplSearch, null, this.filter)
            .subscribe(
                nodes => this.nodes = nodes,
                error => this.logger.error2(error));
    }

    selectNode(e) {
        
        if (!this.editMode) {
            let id = e.node.data["id"];
            this.router.navigate([e.node.leaf ? `/employees/${id}` : `/orgs/${id}`]);
        }
    }


    removeOrganization(id: number, name?: string) {
        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () =>

                this.organizationService
                    .delete(id)
                    .subscribe(
                    _ => {

                        //let ix = this.organizations.findIndex(h => h.id === id);
                        //this.organizations.splice(ix, 1);
                    },
                    error => this.logger.error2(error))

        });
    }

    searchKindChange(e) {

        let expanded = this.nodes
            .filter(n => n.expanded)
            .map(n => n.data.id);

        // обновить дерево, учитывая открытые узлы
        this.organizationService
            .getAll(this.emplSearch, null, this.filter)
            .subscribe(
                nodes => {

                    nodes.forEach(n => {

                        if (expanded.indexOf(n.data.id) !== -1) {
                            this.loadNode({ node: n });    
                            n.expanded = true;
                        }
                        
                    });

                    this.nodes = nodes;
                },
                error => this.logger.error2(error));

        this.searchTitle = e.checked ? "По сотрудникам" : "По организациям";
    }
}