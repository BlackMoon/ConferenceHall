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
    memberForm: FormGroup;
    memberId: number;
    members: EmployeeModel[];
    member: EmployeeModel;
   
    constructor(private route: ActivatedRoute,
        private fb: FormBuilder,
        private memberService: EmployeeService,

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
        this.memberForm = this.fb.group({
            id: [null],
            name: [null],
            jobTitle: [null],
            contacts: []
        });
       
        this.route.params

            .switchMap((params: Params) => {
               
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.memberService.get(key) : Observable.empty();
            })
            .subscribe((member: EmployeeModel) => {
               this.memberForm.patchValue(member);
            });
    }
    save(event, member) {

        event.preventDefault();

        this.memberService[member.id ? 'update' : 'add'](member)
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
            