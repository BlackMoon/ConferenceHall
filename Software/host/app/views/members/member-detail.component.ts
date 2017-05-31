
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
    template: ``
})
export class MemberDetailComponent implements OnInit {


    id: number;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {

        this.route.params
            .subscribe((params: Params) => {
                // (+) converts string 'id' to a number
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
            });
    }
}