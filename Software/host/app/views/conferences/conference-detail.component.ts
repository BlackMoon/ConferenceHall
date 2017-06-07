import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, SchemeModel } from '../../models';
import { InputTextareaModule, InputTextModule, DropdownModule, SelectItem, ButtonModule, DataGridModule, CalendarModule } from 'primeng/primeng';
import { ConferenceService } from './conference.service';
import { HallService } from '../halls/hall.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchemeService } from "../schemes/scheme.service";
import { TimeRange } from '../../models';
import { DateToUtcPipe } from "../../common/pipes";
import { locale } from "../../common/locale";

@Component({
    selector: "conference-detail",
    templateUrl: "conference-detail.component.html",
    styleUrls: ['conference-detail.component.css']
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
            subject: [null, [Validators.required, Validators.maxLength(10)]],
            hallId: [null, Validators.required],
            description: [null, Validators.required],
            startDate: [null, [Validators.required, this.validateStartAndEndDate]],
            endDate: [null, [Validators.required, this.validateStartAndEndDate]],
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
            error => this.logger.error2(error));

        this.conferenceForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    validateStartAndEndDate(input) {
             
        if (!input || !input.root.controls) return null;
        var startDt = null;
        if ("startDate" in input.root.controls)
            startDt = input.root.controls["startDate"].value;

        var endDt = null;
        if ("endDate" in input.root.controls)
            endDt = input.root.controls["endDate"].value;

        if (!startDt || !endDt) return null;
        return startDt <= endDt ? null : {'validateStartAndEndDate' : true};
    }

    ngOnInit() {
        var validationMessages = this.validationMessages;
        for (var item in validationMessages) {
            if (!validationMessages.hasOwnProperty(item)) continue;
            this.formErrors[item] = '';
        }
    }


    save(event, conferenceObj) {
        if (!this.conferenceForm.valid) {
            for (const field in this.formErrors) {
                if (!this.formErrors.hasOwnProperty(field)) continue;
                const control = this.conferenceForm.get(field);
                if (control)
                    control.markAsDirty(true);
            }
            this.onValueChanged();
            return;
        }

        if ("startDate" in conferenceObj && conferenceObj.startDate)
            conferenceObj.startDate = this.dateToUtcPipe.transform(conferenceObj.startDate);

        if ("endDate" in conferenceObj && conferenceObj.endDate)
            conferenceObj.endDate = this.dateToUtcPipe.transform(conferenceObj.endDate);

        this.conferenceService[this.confId && this.confId > 0 ? 'update' : 'add'](conferenceObj)
            .subscribe((): void => this.location.back(),
            error => this.logger.error2(error));
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
                this.hallScheme = schemeArray.map(h => <any>{ label: h.name, value: h.id });
            });
    }

    formErrors = {};
    validationMessages = {
        subject: {
            required: 'Поле "Тема" обязательно для заполнения.'
        },
        description: {
            required: 'Поле "Описание" обязательно для заполнения.'
        },
        hallId: {
            required: 'Поле "Холл" обязательно для заполнения.'
        },
        startDate: {
            required: 'Поле "Дата начала" обязательно для заполнения.',
            validateStartAndEndDate: 'Неправильно заполнены поля "Дата начала" и "Дата окончания".'
        },
        endDate: {
            required: 'Поле "Дата окончания" обязательно для заполнения.',
            validateStartAndEndDate: 'Неправильно заполнены поля "Дата начала" и "Дата окончания".'
        }
    };

    onValueChanged(data?: any) {
        if (!this.conferenceForm) return;
        const form = this.conferenceForm;
        var formErrors = this.formErrors;
        for (const field in formErrors) {
            if (!formErrors.hasOwnProperty(field)) continue;
            // clear previous error message (if any)
            formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    if (!control.errors.hasOwnProperty(key)) continue;
                    formErrors[field] += "key" in messages ? messages[key] : '  ' + '  ';
                }
            }

        }
    }
}