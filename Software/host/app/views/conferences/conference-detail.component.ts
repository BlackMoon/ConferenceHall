import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Accordion } from 'primeng/components/accordion/accordion';
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
    host: { '(window:resize)': "onResize($event)" },
    templateUrl: "conference-detail.component.html"
})
export class ConferenceDetailComponent implements AfterViewInit, OnInit {

    id: number;
    schemeId :number;

    conferenceForm: FormGroup;
    locale: any;

    /**
     * Валидация
     */
    requireValidation: boolean;

    halls: any[];
    schemes: any[];
    states: SelectItem[];

    @ViewChild(Accordion) accordion: Accordion;
    @ViewChild(SchemeMainComponent) schemeMain: SchemeMainComponent;

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

        let stateKeys = Object
            .keys(ConfState)
            .filter(k => typeof ConfState[k] !== "function");

        this.states = stateKeys
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

    ngAfterViewInit() {
        this.onResize();
    }

    ngOnInit() {

        this.conferenceForm = this.fb.group({
            id: [null],
            confState: [null],
            subject: [null, Validators.required],
            hallId: [null],
            schemeId: [null],
            description: [null],
            startDate: [null],
            endDate: [null]
        });

        this.conferenceForm.get("id")
            .valueChanges
            .subscribe(value => {

                this.id = value;
                this.requireValidation = true;

                ["hallId", "schemeId", "startDate", "endDate"].forEach(c => {
                    
                    let control = this.conferenceForm.get(c);
                    if (control) {
                        control.setValidators([Validators.required]);
                        control.updateValueAndValidity();
                    }
                });
            });

        this.conferenceForm.get("hallId")
            .valueChanges
            .subscribe(value => {
                
                if (value != null) {
                    this.schemeService
                        .getAll(value)
                        .subscribe(
                            schemes => this.schemes = schemes.map(h => <SelectItem>{ label: h.name, value: h.id }),
                            error => this.logger.error2(error)
                        );
                }

            });

        this.conferenceForm.get("schemeId")
            .valueChanges
            .subscribe(value => this.schemeId = value);

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls.map(h => <SelectItem>{ label: h.name, value: h.id }),
                error => this.logger.error2(error));

        this.route.params
            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return this.id ? this.conferenceService.get(this.id) : Observable.empty();
            })
            .subscribe(
                conference => {

                    // startDate/endDate in string --> create
                    conference.startDate && (conference.startDate = new Date(conference.startDate));
                    conference.endDate && (conference.endDate = new Date(conference.endDate));
                    
                    this.conferenceForm.patchValue(conference);
                },
                error => this.logger.error2(error));
        
    }

    onResize() {

        // [Участники, Схема]
        const computedTabs: number[] = [2, 3];

        let tabs = this.accordion.el.nativeElement.querySelectorAll("div.ui-accordion-content");

        [].forEach.call(tabs,
            (tab, ix) => (computedTabs.indexOf(ix) !== -1) && (tab.style.height = `${screen.height / 2}px`));
    }

    save(event, conference) {
        
        conference.startDate && (conference.startDate = this.dateToUtcPipe.transform(conference.startDate));
        conference.endDate && (conference.endDate = this.dateToUtcPipe.transform(conference.endDate));
        
        this.conferenceService[conference.id ? "update" : "add"](conference)
            .subscribe(
                _ => this.location.back(),
                error => this.logger.error2(error));
    }
}