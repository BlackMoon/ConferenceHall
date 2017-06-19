import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { InputTextareaModule, InputTextModule, DropdownModule, SelectItem, ButtonModule, DataGridModule, CalendarModule, PanelModule } from 'primeng/primeng';
import { locale } from "../../common/locale";
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, SchemeModel, TimeRange } from '../../models';

import { ConferenceService } from './conference.service';
import { HallService } from '../halls/hall.service';
import { SchemeService } from "../schemes/scheme.service";
import { MemberService } from "../members/member.service";

import { DateToUtcPipe } from "../../common/globals/pipes";
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
    confMembers: any[];

    @ViewChild(SchemeMainComponent) schemeMain: SchemeMainComponent;
    @ViewChild('tabSchemeWrapper') tabSchemeWrapper: ElementRef;
    @ViewChild('tabMemberWrapper') tabMemberWrapper: ElementRef;

    constructor(
        private dateToUtcPipe: DateToUtcPipe,
        private fb: FormBuilder,
        private conferenceService: ConferenceService,
        private hallService: HallService,
        private schemeService: SchemeService,
        private memberService: MemberService,
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
            });
    }

    ngOnInit() {

        this.conferenceForm = this.fb.group({
            id: [null],
            confState: [null],
            subject: [null, Validators.required],
            hallId: [null, Validators.required],
            schemeId: [null],
            description: [null, Validators.required],
            startDate: [null],
            endDate: [null]
        });

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls.map(h => <any>{ label: h.name, value: h.id }),
                error => this.logger.error2(error));

        this.route.params
            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.conferenceService.get(key) : Observable.empty();
            })
            .subscribe(conference => {
                            //this.dataBindScheme(conf.hallId);
                            //conf.startDate = new Date(conf.startDate);
                            //conf.endDate = new Date(conf.endDate);
                    debugger;
                    this.conferenceForm.patchValue(conference);
                },
                error => this.logger.error2(error));


        /*this.conferenceForm.valueChanges
            .subscribe(data => this.onValueChanged(data), error => this.logger.error2(error));

        for (var item in this.validationMessages) {
            if (!this.validationMessages.hasOwnProperty(item)) continue;
            this.formErrors[item] = '';
        }*/
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
            //tabMembers
            case 1:
                {
                    debugger;
                    this.tabMemberWrapper.nativeElement.style.height = "500px";
                    if (!this.confId || this.confId <= 0) break;
                    this.memberService
                        .getAll(this.confId)
                        .subscribe((members: any) => this.confMembers = members,
                        error => this.logger.error2(error));
                    break;
                }
            //tabScheme
            case 2:
                {
                    this.schemeMain.canvasBox.innerHTML = "";//удаляем старую схему обновления
                    if (this.conferenceForm.value && this.conferenceForm.value.hallSchemeId)
                        this.schemeMain.schemeId = this.conferenceForm.value.hallSchemeId;

                    //if (this.conferenceForm.value && this.conferenceForm.value.id) {
                    //    this.memberTable.conferenceId = this.conferenceForm.value.id;
                    //    this.memberTable.loadMembers();
                    //}
                    break;
                }
        }
    }

    shemeMainLoaded(e) {
        this.tabSchemeWrapper.nativeElement.style.height = "500px";
        this.schemeMain && this.schemeMain.onResize();
    }

    memberDragEnd(e) {
        debugger;

    }

    memberDrop(e) {
        debugger;
    }

    memberDragStart($event, member: any) {
        debugger;
    }
}