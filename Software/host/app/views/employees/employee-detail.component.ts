import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ContactModel, EmployeeModel } from '../../models';
import { EmployeeService } from './employee.service';

@Component({
    selector: "employee-detail",
    templateUrl: "employee-detail.component.html"
})
export class EmployeeDetailComponent implements OnInit {
    displayDialog: boolean;

    contact: ContactModel;
    contacts: ContactModel[];
    newContact: boolean;
    id: number;
    employeeForm: FormGroup;
    employeeId: number;
    employees: EmployeeModel[];
    employee: EmployeeModel;
   
    constructor(private route: ActivatedRoute,
        private fb: FormBuilder,
        private employeeService: EmployeeService,

        private location: Location,
        private logger: Logger
    ) {

        //this.route.params
        //    .subscribe((params: Params) => {
        //        // (+) converts string 'id' to a number
        //        this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;

        //        // (+) converts string 'id' to a number
        //        console.log(params["id"]);
        //        //this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
        //    });
    }

    ngOnInit() {
        this.employeeForm = this.fb.group({
            id: [null],
            name: [null],
            job: [null],
            position: [null],
            role: [null],
            contacts: []
        });
       
        this.route.params

            .switchMap((params: Params) => {
               
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.employeeService.get(key) : Observable.empty();
            })
            .subscribe((employee: EmployeeModel) => {
               this.employeeForm.patchValue(employee);
            });
    }
    save(event, employee) {

        event.preventDefault();

        this.employeeService[employee.id ? 'update' : 'add'](employee)
            .subscribe(_ => this.location.back(),
            error => this.logger.error2(error));
    }

    phoneKeyPressed(event) {

                (event.keyCode === 13) && alert(event.target.value);
            }
    showDialogToAdd() {
                debugger;
                this.newContact = true;
                this.contact = new ContactModel();
                this.displayDialog = true;
            }
        }
            