import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectItem, TreeNode } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ContactModel, EmployeeModel } from '../../models';
import { EmployeeService } from './employee.service';
import { OrganizationService } from '../organizations/organization.service';

@Component({
    selector: "employee-detail",
    templateUrl: "employee-detail.component.html"
})
export class EmployeeDetailComponent implements OnInit {
    
    employeeForm: FormGroup;

    contacts: ContactModel[] = [];
    orgs: SelectItem[];

    constructor(
        private employeeService: EmployeeService,
        private organizationService: OrganizationService,
        private fb: FormBuilder,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.employeeForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            orgId: [null, Validators.required],
            position: [null]
        });

        this.organizationService
            .getAll(false)
            .subscribe(
                nodes => this.orgs = nodes.map(n => <any>{ label: n.data["name"], value: n.data["id"] }),
                error => this.logger.error2(error)
            );

        this.route.params
            .switchMap((params: Params) => {
                let orgid = params.hasOwnProperty("orgid") ? +params["orgid"] : undefined;
                orgid && this.employeeForm.patchValue({ orgId: orgid });

                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.employeeService.get(key) : Observable.empty();
            })
            .subscribe(
                employee => {
                    this.contacts = employee.contacts;
                    this.employeeForm.patchValue(employee);
                },
                error => this.logger.error2(error)
            );
    }

    save(event, employee) {

        event.preventDefault();

        employee.contacts = this.contacts;

        this.employeeService[employee.id ? 'update' : 'add'](employee)
            .subscribe(
                _ => this.location.back(),
                error => this.logger.error2(error));
    }
}
            