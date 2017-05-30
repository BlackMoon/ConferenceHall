import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, confDragType } from '../../models';
import { InputTextareaModule, InputTextModule, DropdownModule, SelectItem, ButtonModule, DataGridModule, CalendarModule } from 'primeng/primeng';
import { ConferenceService } from './conference.service';
import { HallService } from '../halls/hall.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: "conference-detail",
    templateUrl: "conference-detail.component.html"
})
export class ConferenceDetailComponent implements OnInit {

    conferenceForm: FormGroup;
    confId: number;
    confTypes: SelectItem[];
    halls: any[];





    selectedConfType: string;
    conferences: ConferenceModel[];

    conference: ConferenceModel;

    constructor(
        private fb: FormBuilder,
        private conferenceService: ConferenceService,
        private hallService: HallService,
        private location: Location,
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
       
        //var confs = this.conferenceService.getAll(new Date(1, 1, 1), new Date(2017, 12, 12))
        //.subscribe(
        //    conferences => this.conferences = conferences,
        //    error => this.logger.error(error));
        //var qq = this.conferences;
    }

    ngOnInit() {

        debugger;
        this.conferenceForm = this.fb.group({
            id: [null],
            subject: [null],
            hallId: [null],
            description: [null],
            period: [null]
        });

        this.hallService
            .getAll()
            .subscribe(
            halls => this.halls = halls.map(h => <any>{ label: h.name, value: h.id }),
            error => this.logger.error(error));
    }
    

    save(event, conferenceObj) {
        debugger;
        //var qq = subjectTxt;
        //var qq2 = this.selectedConfType;
        //this.conference.description

        event.preventDefault();

        this.conferenceService['add'](conferenceObj)
            .subscribe(_ => this.location.back(),
            error => this.logger.error(error));

        //this.hallService[hall.id ? 'update' : 'add'](hall)
        //    .subscribe(_ => this.location.back(),
        //    error => this.logger.error(error));
    }

    hallChanged(conferenceObj) {
        debugger;
        var qq = conferenceObj;
    }
}