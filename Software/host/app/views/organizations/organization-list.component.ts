import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConfirmationService } from 'primeng/primeng';
import { OrganizationModel } from "../../models";
import { OrganizationService } from "./organization.service";

const minChars = 3;

@Component({
    selector: "organization-list",
    templateUrl: 'organization-list.component.html'
})
export class OrganizationListComponent implements OnInit {

    filter: string;
    organizations: OrganizationModel[];

    selectedAll: boolean;
    selectedOrgIds: number[] = [];

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

    loadOrganizations() {

        this.organizationService
            .getAll(this.filter)
            .subscribe(orgs => this.organizations = orgs,
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

                        let ix = this.organizations.findIndex(h => h.id === id);
                        this.organizations.splice(ix, 1);
                    },
                    error => this.logger.error2(error))

        });           
    }

    selectAll() {
       
        this.organizations.forEach(o => {
            o.selected = this.selectedAll;
        });

        this.selectedAll ? this.selectedOrgIds = this.organizations.map(o => o.id) : [];
    }

    selectOrganization(org: OrganizationModel) {
        org.selected = !org.selected;

        if (org.selected)
            this.selectedOrgIds.push(org.id);
        else {
            let ix = this.selectedOrgIds.indexOf(org.id);
            this.selectedOrgIds.splice(ix, 1);
        }
    }
}