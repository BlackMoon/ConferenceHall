import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { OrganizationModel } from '../../models';
import { OrganizationService } from "./organization.service";

@Component({
    templateUrl: "organization-detail.component.html"
})
export class OrganizationDetailComponent implements OnInit {

    private items: MenuItem[];

    orgForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private organizationService: OrganizationService,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) {

        this.items = [
            { label: 'Организация', icon: 'fa-building' },
            { label: 'Адрес', icon: 'fa-address-card-o' }
        ];
    }

    ngOnInit() {

        this.orgForm = this.fb.group({
            id: [null],
            code: [null, Validators.required],
            name: [null, Validators.required],
            description: [null]
        });

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.organizationService.get(key) : Observable.empty();
            })
            .subscribe((org: OrganizationModel) => {
                
                this.orgForm.patchValue(org);
            });

    }
    
}