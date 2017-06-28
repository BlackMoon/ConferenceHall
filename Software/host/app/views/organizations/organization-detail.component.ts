import { Location } from '@angular/common';
import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUpload } from 'primeng/components/fileupload/fileupload';
import { MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { OrganizationModel } from '../../models';
import { OrganizationService } from "./organization.service";

@Component({
    styleUrls: ["organization-detail.component.css"],
    templateUrl: "organization-detail.component.html"
})
export class OrganizationDetailComponent implements OnInit {
    /**
     * id элемента
     */
    id?: number;

    orgForm: any;

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
            address: [null],
            code: [null, Validators.required],
            description: [null],
            name: [null, Validators.required]
        });

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return this.id ? this.organizationService.get(this.id) : Observable.empty();
            })
            .subscribe((org: OrganizationModel) => this.orgForm.patchValue(org));

    }

    onSelect = () => this.fileUpload.styleClass = "";

    save(event, org) {
        
        event.preventDefault();

        (this.fileUpload.files.length > 0) && (org.logo = this.fileUpload.files[0]);

        this.organizationService[org.id ? "update" : "add"](org)
            .subscribe(
                _ => this.logger.info("Ok"),
                error => this.logger.error2(error));
    }
    
}
 
