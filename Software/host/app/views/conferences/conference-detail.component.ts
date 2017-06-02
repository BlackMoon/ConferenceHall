import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, confDragType } from '../../models';
import { InputTextareaModule, InputTextModule, DropdownModule, SelectItem, ButtonModule, DataGridModule, CalendarModule } from 'primeng/primeng';
import { ConferenceService } from './conference.service';
import { HallService } from '../halls/hall.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchemeService } from  "../schemes/scheme.service";
import { TimeRange } from '../../models';
import { DateToUtcPipe } from "../../common/pipes";

@Component({
    selector: "conference-detail",
    templateUrl: "conference-detail.component.html"
})
export class ConferenceDetailComponent implements OnInit {

    conferenceForm: FormGroup;
    confId: number;
    confTypes: SelectItem[];
    halls: any[];
    hallSchemes: any[];
    startDate: Date;
    endDate: Date;

    selectedConfType: string;
    conferences: ConferenceModel[];

    conference: ConferenceModel;

    constructor(
        private dateToUtcPipe: DateToUtcPipe,
        private fb: FormBuilder,
        private conferenceService: ConferenceService,
        private hallService: HallService,
        private schemeService: SchemeService,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute) {

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

        this.hallService
            .getAll()
            .subscribe(
            halls => this.halls = halls.map(h => <any>{ label: h.name, value: h.id }),
            error => this.logger.error(error));
    }

    ngOnInit() {

        debugger;
        this.conferenceForm = this.fb.group({
            id: [null],
            subject: [null],
            hallId: [null],
            description: [null],
            period: { lowerBound: this.startDate, upperBound: this.endDate}
        });
    }
    

    save(event, conferenceObj) {
        debugger;

        conferenceObj.period.lowerBound = this.dateToUtcPipe.transform(conferenceObj.period.lowerBound);
        conferenceObj.period.upperBound = this.dateToUtcPipe.transform(conferenceObj.period.upperBound);
     
        event.preventDefault();

        this.conferenceService['add'](conferenceObj)
            .subscribe(_ => this.location.back(),
            error => this.logger.error(error));
    }

    hallChanged(conferenceObj) {
        debugger;
        if (!conferenceObj) return;


        //this.schemeService.getAll(conferenceObj.hallId)
        //    .subscribe(
        //    halls => this.hallSchemes = halls.map(h => <any>{ label: h.name, value: h.id }),
        //    error => this.logger.error(error));

        

        //this.schemeService
        //    .getAll()
        //    .subscribe(
        //    schemes => this.hallSchemes = schemes.map(h => <any>{ label: h.name, value: h.id }),
        //    error => this.logger.error(error));
       
    }
}