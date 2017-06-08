﻿import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

    constructor(
        private confirmationService: ConfirmationService,
        private organizationService: OrganizationService,
        private logger: Logger) { }

    ngOnInit() {
        this.loadOrganizations();
    }

    loadOrganizations() {

        this.organizationService
            .getAll()
            .subscribe(orgs => this.organizations = orgs,
                error => this.logger.error2(error));
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
}