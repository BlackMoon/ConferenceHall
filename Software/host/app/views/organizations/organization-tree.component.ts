import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConfirmationService, TreeNode } from 'primeng/primeng';
import { OrganizationNode } from "../../models";
import { OrganizationService } from "./organization.service";

const minChars = 3;

@Component({
    selector: "organization-tree",
    templateUrl: 'organization-tree.component.html'
})
export class OrganizationTreeComponent implements OnInit {

    items: TreeNode[];

    filter: string;
    selectedOrgId?: number;

    constructor(
        private confirmationService: ConfirmationService,
        private organizationService: OrganizationService,
        private logger: Logger) { }

    ngOnInit() {
        this.loadOrganizations();
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

    loadNode(event) {

        if (event.node) {

            this.organizationService
                .getAll(event.node.data["id"], this.filter)
                .subscribe(
                    nodes => event.node.children = nodes,
                    error => this.logger.error2(error));

            
        }
    }

    loadOrganizations() {

        this.organizationService
            .getAll(null, this.filter)
            .subscribe(
                nodes => this.items = nodes,
                error => this.logger.error2(error));
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
}