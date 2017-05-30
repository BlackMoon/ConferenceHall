import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, confDragType } from '../../models';
import { InputTextareaModule, InputTextModule, DropdownModule, SelectItem, ButtonModule, DataGridModule } from 'primeng/primeng';
import { ConferenceService } from './conference.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: "conference-detail",
    templateUrl: "conference-detail.component.html"
})
export class ConferenceDetailComponent implements OnInit {

    conferenceForm: FormGroup;

    confId: number;
    confTypes: SelectItem[];
    selectedConfType: string;
    conferences: ConferenceModel[];

    conference: ConferenceModel;

    constructor(
        private fb: FormBuilder,
        private conferenceService: ConferenceService,
        private logger: Logger,
        private route: ActivatedRoute) {
        debugger;
        this.confTypes = [];

        let stateKeys = Object
            .keys(ConfState)
            .filter(k => typeof ConfState[k] !== "function");

        this.confTypes = stateKeys
            .slice(stateKeys.length / 2)
            .map(k => {
                    let state = ConfState[k];
                    return <SelectItem>
                    {
                        label: ConfState.toName(state),
                        value: state
                    }
                }
            );

        this.route.params
            .subscribe((params: Params) => {
                //debugger;
                this.confId = params.hasOwnProperty("id") ? +params["id"] : null;
                
                // (+) converts string 'id' to a number
                console.log(params["id"]);
                //this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
            });
       
        var confs = this.conferenceService.getAll(ConfState.Active, new Date(1, 1, 1), new Date(2017, 12, 12))
        .subscribe(
            conferences => this.conferences = conferences,
            error => this.logger.error(error));

    }

    ngOnInit() {
        this.conferenceForm = this.fb.group({
            id: [null],
            subject: [null],
            description: [null]
        });

    }
    

    save(e, conferenceObj) {
        debugger;
        //var qq = subjectTxt;
        //var qq2 = this.selectedConfType;
        //this.conference.description
    }
}