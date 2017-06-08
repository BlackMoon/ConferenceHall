import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { SchemeMainComponent } from "../schemes/scheme-main.component";

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
    @ViewChild(SchemeMainComponent) schemeMain: SchemeMainComponent;
    @ViewChild('tabSchemeWrapper') tabSchemeWrapper: ElementRef;
    @ViewChild('schemeContent') schemeContent: ElementRef;

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
            startDate: [null, this.confId && this.confId > 0 ? [Validators.required, this.validateStartAndEndDate] : this.validateStartAndEndDate],
            endDate: [null, this.confId && this.confId > 0 ? [Validators.required, this.validateStartAndEndDate] : this.validateStartAndEndDate],
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

                            if (!conf) return;
                            this.dataBindScheme(conf.hallId);
                            conf.startDate = new Date(conf.startDate);
                            conf.endDate = new Date(conf.endDate);

                            this.conferenceForm.patchValue(conf);
                        });

                console.log("id = " + this.confId);
            }, error => this.logger.error2(error));

        this.hallService
            .getAll()
            .subscribe(
            halls => this.halls = halls.map(h => <any>{ label: h.name, value: h.id }),
            error => this.logger.error2(error));

        this.conferenceForm.valueChanges
            .subscribe(data => this.onValueChanged(data), error => this.logger.error2(error));
    }

    ngOnInit() {
        for (var item in this.validationMessages) {
            if (!this.validationMessages.hasOwnProperty(item)) continue;
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
            .subscribe((schemeArray: SchemeModel[]) => this.hallScheme = schemeArray.map(h => <any>{ label: h.name, value: h.id }),
            error => this.logger.error2(error)
            );
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
                    formErrors[field] += key in messages ? messages[key] : '  ' + '  ';
                }
            }

        }
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
        return startDt <= endDt ? null : { 'validateStartAndEndDate': true };
    }

    tabViewChangedHandle(e) {
        switch (e.index) {
            case 2:
                {
                    this.schemeMain.canvasBox.innerHTML = "";//удаляем старую схему обновления
                    if (this.conferenceForm.value && this.conferenceForm.value.hallSchemeId) 
                        this.schemeMain.schemeId = this.conferenceForm.value.hallSchemeId;
                    break;
                }
        }
    }

    shemeMainLoaded(e) {
        debugger;
        this.tabSchemeWrapper.nativeElement.style.height = "500px";
        this.schemeMain && this.schemeMain.onResize();
    }
}