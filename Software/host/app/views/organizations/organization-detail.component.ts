import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUpload } from 'primeng/components/fileupload/fileupload';
import { MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { OrganizationModel } from '../../models';
import { OrganizationService } from "./organization.service";

@Component({
    templateUrl: "organization-detail.component.html"
})
export class OrganizationDetailComponent implements OnInit {
    orgForm: FormGroup;

    @ViewChild('fileUpload') fileUpload: FileUpload;

    constructor(
        private fb: FormBuilder,
        private organizationService: OrganizationService,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.orgForm = this.fb.group({
            id: [null],
            code: [null, Validators.required],
            name: [null, Validators.required],
            address: [null],
            description: [null]
        });

        this.route.params

            .switchMap((params: Params) => {
                debugger;
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.organizationService.get(key) : Observable.empty();
            })
            .subscribe((org: OrganizationModel) => this.orgForm.patchValue(org));

    }

    save(event, org) {
        
        event.preventDefault();

        (this.fileUpload.files.length > 0) && (org.logo = this.fileUpload.files[0]);

        this.organizationService[org.id ? "update" : "add"](org)
            .subscribe(
                _ => this.location.back(),
                error => this.logger.error2(error));
    }
    
}