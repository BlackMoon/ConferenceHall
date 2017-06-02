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

        this.conference = null;
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


        this.conferenceForm = this.fb.group({
            id: [null],
            subject: [null],
            hallId: [null],
            description: [null],
            startDate: [null],
            endDate: [null]
        });

        this.route.params
            .subscribe((params: Params) => {
                debugger;
                this.confId = params.hasOwnProperty("id") ? +params["id"] : null;
                if (this.confId && this.confId > 0)
                    this.conferenceService
                        .get(this.confId)
                        .subscribe((conf: any) => {
                            debugger;
                            this.conference = conf;
                            if (!this.conference) return;
                            this.conferenceForm.setValue({
                                id: conf.id,
                                subject: conf.subject,
                                hallId: conf.hallId,
                                description: conf.description,
                                startDate: conf.startDate,
                                endDate: [null]
                            });
                            this.conferenceForm.patchValue(this.conference);
                        });
                
                console.log("id = " + this.confId);
            });

        this.hallService
            .getAll()
            .subscribe(
            halls => this.halls = halls.map(h => <any>{ label: h.name, value: h.id }),
            error => this.logger.error(error));
    }

    ngOnInit() {

        debugger;
        

    }
    

    save(event, conferenceObj) {
        debugger;

        if (conferenceObj.lowerBound)
            conferenceObj.lowerBound = this.dateToUtcPipe.transform(conferenceObj.lowerBound);
        if (conferenceObj.upperBound)
            conferenceObj.upperBound = this.dateToUtcPipe.transform(conferenceObj.upperBound);
     
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