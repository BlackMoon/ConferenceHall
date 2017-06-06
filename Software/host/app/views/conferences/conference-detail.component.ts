import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, SchemeModel } from '../../models';
import { InputTextareaModule, InputTextModule, DropdownModule, SelectItem, ButtonModule, DataGridModule, CalendarModule } from 'primeng/primeng';
import { ConferenceService } from './conference.service';
import { HallService } from '../halls/hall.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchemeService } from  "../schemes/scheme.service";
import { TimeRange } from '../../models';
import { DateToUtcPipe } from "../../common/pipes";
import { locale } from "../../common/locale";

@Component({
    selector: "conference-detail",
    templateUrl: "conference-detail.component.html"
})
export class ConferenceDetailComponent implements OnInit {

    conferenceForm: FormGroup;
    confId: number;
    confTypes: SelectItem[];
    halls: any[];
    hallScheme: any[];
    locale: any;

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
        this.locale = locale;
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
            subject: [null, Validators.required],
            hallId: [null, Validators.required],
            description: [null, Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            confState: [null],
            hallSchemeId: [null]
        });

        this.route.params
            .subscribe((params: Params) => {
                this.confId = params.hasOwnProperty("id") ? +params["id"] : null;
                if (this.confId && this.confId > 0)
                    this.conferenceService
                        .get(this.confId)
                        .subscribe((conf: ConferenceModel) => {
                            debugger;
                            this.conference = conf;
                            if (!this.conference) return;

                            this.dataBindScheme(this.conference.hallId);
                            this.conference.startDate = new Date(conf.startDate);
                            this.conference.endDate = new Date(conf.endDate);

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

    }
    

    save(event, conferenceObj) {

        if ("startDate" in conferenceObj && conferenceObj.startDate)
            conferenceObj.startDate = this.dateToUtcPipe.transform(conferenceObj.startDate);

        if ("endDate" in conferenceObj && conferenceObj.endDate)
            conferenceObj.endDate = this.dateToUtcPipe.transform(conferenceObj.endDate);

        this.conferenceService[this.confId && this.confId > 0 ? 'update' : 'add'](conferenceObj)
            .subscribe(_ => this.location.back(),
            error => this.logger.error(error));
    }

    hallChanged(conferenceObj) {
        if (!conferenceObj || !conferenceObj.hallId) return;
        this.dataBindScheme(conferenceObj.hallId);
    }

    dataBindScheme(hallId: number) {
        delete this.hallScheme;
        this.hallScheme = [];
        this.schemeService
            .getAll(hallId)
            .subscribe((schemeArray: SchemeModel[]) => {
                debugger;
                this.hallScheme = schemeArray.map(h => <any>{ label: h.name, value: h.id });
                //this.conferenceForm.setValue({ hallScheme:});
            });
    }
}