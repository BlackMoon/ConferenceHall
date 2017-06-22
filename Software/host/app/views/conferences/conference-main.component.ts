import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Accordion } from 'primeng/components/accordion/accordion';
import { locale } from "../../common/locale";
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, EmployeeModel, MemberModel, TimeRange } from '../../models';

import { ConferenceService } from './conference.service';
import { EmployeeService } from '../employees/employee.service';
import { HallService } from '../halls/hall.service';
import { MemberService } from '../members/member.service';
import { SchemeService } from "../schemes/scheme.service";

import { DateToUtcPipe } from "../../common/globals/pipes";
import { MemberTableComponent } from "../members/member-table.component";
import { OrganizationTreeComponent } from "../organizations/organization-tree.component";
import { SchemeMainComponent } from "../schemes/scheme-main.component";

@Component({
    host: { '(window:resize)': "onResize($event)" },
    styles: [".ui-picklist-buttons { display: table-cell; vertical-align: middle }",
             ".ui-picklist-buttons button { margin-bottom: 0.25em }"],
    templateUrl: "conference-main.component.html"
})
export class ConferenceMainComponent implements AfterViewInit, OnInit {
    
    conferenceForm: FormGroup;
    locale: any;
   
    schemeId: number;
    members: MemberModel[] = [];

    /**
     * Валидация
     */
    requireValidation: boolean;

    halls: any[];
    schemes: any[];
    seats: SelectItem[];
    states: SelectItem[];

    selectedEmployees: EmployeeModel[] = [];
    selectedMembers: MemberModel[] = [];

    @ViewChild(Accordion) accordion: Accordion;
    @ViewChild(OrganizationTreeComponent) organizationTree: OrganizationTreeComponent;
    @ViewChild(SchemeMainComponent) schemeMain: SchemeMainComponent;

    constructor(
        private dateToUtcPipe: DateToUtcPipe,
        private fb: FormBuilder,
        private conferenceService: ConferenceService,
        private employeeService: EmployeeService,
        private hallService: HallService,
        private memberService: MemberService,
        private schemeService: SchemeService,
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
            description: [null],
            hallId: [null],
            schemeId: [null],
            startDate: [null],
            endDate: [null],
            // Показывать схему/список
            showScheme: [false]
        });

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls.map(h => <SelectItem>{ label: h.name, value: h.id }),
                error => this.logger.error2(error));

        this.route.params
            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                
                if (key) {
                    this.loadMembers(key);
                    return this.conferenceService.get(key);
                }

                return Observable.empty();
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

    employeeTreeChanged() {
        this.selectedEmployees = this.organizationTree.getEmployees();
    }

    hallChange(value) {

        this.schemeService
            .getAll(value)
            .subscribe(
                schemes => this.schemes = schemes.map(h => <SelectItem>{ label: h.name, value: h.id }),
                error => this.logger.error2(error)
            );

        this.schemeId = null;
    }

    idChange(value) {
        
        this.requireValidation = true;

        ["hallId", "schemeId", "startDate", "endDate"].forEach(c => {

            let control = this.conferenceForm.get(c);
            if (control) {
                control.setValidators([Validators.required]);
                control.updateValueAndValidity();
            }
        });    
    }

    loadMembers(confid) {

        this.memberService
            .getAll(confid)
            .subscribe(
                members => {
                    members.forEach(m => m.oldSeat = m.seat);
                    this.members = members;
                },
                error => this.logger.error2(error)
            );
    }
    
    memberSeatChanged(member) {
        this.schemeMain.toggleMark(member.oldSeat);

        this.memberStateChanged(member);
    }

    memberStateChanged(member) {
        this.schemeMain.toggleMark(member.seat);
    }

    memberTableChahged(members) {
        this.selectedMembers = members;
    }

    moveAllToSource() {
        this.members = [];
    }

    moveToSource() {

        this.selectedMembers.forEach(member => {
            let ix = this.members.findIndex(m => m.id === member.id);
            this.members.splice(ix, 1);
        });    
    }

    moveToTarget() {
        
        // employee --> member
        let members = this.selectedEmployees.map(e => <any>{ employeeId: e.id, name: e.name, job: e.job, position: e.position });

        members.forEach(member => {
            let ix = this.members.findIndex(m => m.employeeId === member.employeeId);
            (ix === -1) && this.members.push(member);
        });
    }

    onResize() {
        
        // [Участники, Схема]
        const computedTabs: number[] = [2, 3];
      
        let tabs = this.accordion.el.nativeElement.querySelectorAll("div.ui-accordion-content");
        
        [].forEach.call(tabs,
            (tab, ix) => (computedTabs.indexOf(ix) !== -1) && (tab.style.height = `${document.documentElement.clientHeight * 0.75}px`));
    }

    save(event, conference) {
       
        conference.startDate && (conference.startDate = this.dateToUtcPipe.transform(conference.startDate));
        conference.endDate && (conference.endDate = this.dateToUtcPipe.transform(conference.endDate));
        conference.members = this.members;

        delete conference["showScheme"];
        
        this.conferenceService[conference.id ? "update" : "add"](conference)
            .subscribe(
                _ => this.logger.info("Ok"),
                error => this.logger.error2(error));
    }

    schemeIdChange(value) {
        this.schemeId = value;
    }

    schemeLoaded() {

        [].forEach.call(this.members, m => this.schemeMain.toggleMark(m.seat));
        this.seats = this.schemeMain.getMarkCodes().map(c => <SelectItem>{ label: c, value: c });
    }

    showSchemeChange(value) {

        value && setTimeout(() => this.schemeMain.onResize(), 0);
    }
}