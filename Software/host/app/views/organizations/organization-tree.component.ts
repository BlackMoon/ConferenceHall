import { AfterViewInit, Component, EventEmitter, OnInit, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConfirmationService, SelectItem, TreeNode } from 'primeng/primeng';
import { EmployeeModel, OrganizationNode, NodeGroupCommand } from "../../models";
import { OrganizationService } from "./organization.service";

const minChars = 3;

enum SearchKind { SearchOrg, SearchEmployee };

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "organization-tree",
    styles: [
        ".ui-panel-content, .ui-panel-content-wrapper { height: 100% }",
        ".ui-panel-titlebar { display: none }",
        ".ui-panel-content.ui-widget-content { padding: 0 !important}"],
    templateUrl: "organization-tree.component.html"
})
export class OrganizationTreeComponent implements OnInit {

    editMode: boolean;
    loading: boolean;
    
    filter: string;

    /**
     * Поиск по сотрудникам/организациям
     */
    emplSearch: boolean;

    /**
     * Режим чтения (для вставки в другой компонент)
     */
    @Input()
    readOnly: boolean;

    /**
     * Выводить id узлов при selectionChanged ?
     */
    @Input()
    emitData: boolean = true;

    @Output() selectionChanged = new EventEmitter<any>();

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

    addEmployee(e, orgid) {
        e.stopPropagation();
        this.router.navigate(["/employees/new", orgid]);
    };

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedNodes.length = 0;
    }

    changeSearchKind(e) {

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

    /**
     * id выбранных узлов (если выделены все дочерние узлы, то в результат попадает только корневой)
     */
    getNodeGroupCommand(): NodeGroupCommand {

        let employees: number[] = [],
            orgs: number[] = [];

        this.selectedNodes.forEach(n => {

            if (n.leaf) {
                let parent = n.parent,
                    id = parent.data["id"];

                let ix = this.selectedNodes.findIndex(n => !n.leaf && n.data["id"] === id);
                (ix === -1) && employees.push(n.data["id"]);
            }
            else
                orgs.push(n.data["id"]);
        });
        
        return { organizationIds: orgs, employeeIds: employees };

    }

    /**
     * Выбранные сотрудники (employees --> узлы 2го уровня)     
     */
    getEmployees(): EmployeeModel[] {

        let employees: EmployeeModel[] = [];
        
        this.selectedNodes.forEach(n => {

            if (n.leaf) {

                // organization == n.parent
                let parent = n.parent,
                    employee = <any>{ id: n.data["id"], name: n.data["name"], position: n.data["description"], job: parent.data["name"] };  
                
                employees.push(employee);
            }
        });

        return employees;
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
     
        this.loading = true;

        this.organizationService
            .getAll(this.emplSearch, null, this.filter)
            .subscribe(
                nodes => {

                    // в режиме [поиск по сотрудникам] --> открывать узлы организаций
                    if (this.emplSearch && this.filter && this.filter.length >= minChars) {
                        nodes.forEach(n => {

                            this.loadNode({ node: n });
                            n.expanded = true;
                        });
                    }

                    this.nodes = nodes;
                    this.loading = false;
                },
                error => {
                    this.logger.error2(error);
                    this.loading = false;
                });
    }

    removeNodes(id: number) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить выбранные записи?`,
            accept: () => {
                
                let c = this.getNodeGroupCommand();
                this.organizationService
                    .delete(c)
                    .subscribe(
                        _ => {

                            this.selectedNodes.forEach(n => {
                                let id = n.data["id"],
                                    nodes: TreeNode[] = n.leaf ? n.parent.children : this.nodes;

                                let ix = nodes.findIndex(n => n.data["id"] === id);
                                (ix !== -1) && nodes.splice(ix, 1);
                            });

                            this.selectedNodes.length = 0;
                        },
                        error => this.logger.error2(error));
            }

        });
    }

    selectNode(e) {
        
        let id;

        if (this.editMode || this.readOnly) {

            if (e.node.parent) {

                let parent = e.node.parent;
                id = parent.data["id"];

                // поиск только среди корневых
                let ix = this.selectedNodes.findIndex(n => !n.leaf && n.data["id"] === id);
                (ix !== -1) && this.selectedNodes.splice(ix, 1);
                delete parent["partialSelected"];
            }   

            if (this.readOnly) {
                let c = this.emitData ? this.getNodeGroupCommand() : undefined;
                this.selectionChanged.emit(c);
            }
        }
        else {
            id = e.node.data["id"];
            this.router.navigate([e.node.leaf ? `/employees/${id}` : `/orgs/${id}`]);    
        }
       
    }

    unSelectNode() {

        if (this.readOnly) {

            let c = this.emitData ? this.getNodeGroupCommand() : undefined;
            this.selectionChanged.emit(c);
        }
    }
}