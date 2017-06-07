import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUpload } from 'primeng/components/fileupload/fileupload';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { MemberModel } from '../../models';
import { MemberService } from './member.service';

@Component({
    selector: "member-detail",
    templateUrl: "member-detail.component.html"
})
export class MemberDetailComponent implements OnInit {


    id: number;
    memberForm: FormGroup;
    memberId: number;
    members: MemberModel[];
    member: MemberModel;
    constructor(private route: ActivatedRoute,
        private fb: FormBuilder,
        private conferenceService: MemberService,

        private location: Location,
        private logger: Logger
    ) {

        this.route.params
            .subscribe((params: Params) => {
                // (+) converts string 'id' to a number
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;

                // (+) converts string 'id' to a number
                console.log(params["id"]);
                //this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
            });
    }
     
   ngOnInit() {
       this.memberForm = this.fb.group({
           id: [null],
           name: [null],
           job_title: [null],
           phones_list: [null],
           email_list: [null],

       });
   }

    //save(event, conferenceObj, startDate, endDate) {
    //    debugger;

    //    conferenceObj.period.lowerBound = startDate ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000) : new Date();//to utc
    //    conferenceObj.period.upperBound = endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000) : new Date();//to utc

    //    event.preventDefault();

    //    this.conferenceService['add'](conferenceObj)
    //        .subscribe(_ => this.location.back(),
    //        error => this.logger.error2(error));
   
        
    //}
}


