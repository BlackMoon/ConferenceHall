import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Accordion } from 'primeng/components/accordion/accordion';
import { locale } from "../../common/locale";
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, EmployeeModel, MemberModel, MemberState, MessageModel } from '../../models';

import { ConferenceService } from './conference.service';
import { EmployeeService } from '../employees/employee.service';
import { HallService } from '../halls/hall.service';
import { MemberService } from '../members/member.service';
import { SchemeService } from "../schemes/scheme.service";

import { DateToUtcPipe } from "../../common/globals/pipes";
import { MessageTableComponent } from "../messages/message-table.component";
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

    // id нужен для добавления новых участников
    id: number;             

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
    @ViewChild(MessageTableComponent) messageTable: MessageTableComponent;
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
            state: [null],
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
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
                
                if (this.id) {
                    this.loadMembers(this.id);
                    this.messageTable.conferenceId = this.id;
                    return this.conferenceService.get(this.id);
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

        // необходимо сохранить (во время асинхронного запроса может поменяться)
        let oldSeat = member.oldSeat;

        this.memberService
            .changeSeat(member.id, member.seat)
            .subscribe(
                _ => {
                    this.schemeMain.toggleMark(oldSeat, false);
                    this.schemeMain.toggleMark(member.seat, true);
                },
                error => this.logger.error2(error));
    }

    memberStateChanged(member) {

        this.memberService
            .changeState(member.id, member.state)
            .subscribe(
                _ => this.schemeMain.toggleMark(member.seat, member.state === MemberState.Confirmed),
                error => this.logger.error2(error));
        
    }

    memberTableChahged(members) {
        this.selectedMembers = members;
    }

    moveAllToSource() {

        let c = { ids: this.members.map(s => s.id) };

        this.memberService
            .delete(c)
            .subscribe(
            _ => {
                this.members.length = 0;        
                this.selectedMembers.length = 0;        
            },
            error => this.logger.error2(error));
    }

    moveToSource() {

        let c = { ids: this.selectedMembers.map(s => s.id) };

        this.memberService
            .delete(c)
            .subscribe(
            _ => {
               
                this.selectedMembers.forEach(member => {
                    let ix = this.members.findIndex(m => m.id === member.id);
                    this.members.splice(ix, 1);
                });

                this.selectedMembers.length = 0;
            },
            error => this.logger.error2(error));
       
    }

    moveToTarget() {
        
        // employee --> member
        let members = this.selectedEmployees.map(e => <any>{ employeeId: e.id, name: e.name, job: e.job, position: e.position });
       
        this.memberService
            .addMembers(this.id, members)
            .subscribe(
                // only new members <id, employeeId>
                nmembers => {
                   
                    nmembers.forEach(nm => {
                        let member:MemberModel = members.find(m => m.employeeId === nm.employeeId);
                       
                        if (member) {
                            member.id = nm.id;
                            this.members.push(member);
                        }
                    });

                    this.selectedMembers.length = 0;
                },
                error => this.logger.error2(error));
       
    }

    onResize() {
        
        // Вкладки [Участники, Схема]
        const computedTabs: number[] = [2, 3];
      
        let tabs = this.accordion.el.nativeElement.querySelectorAll("div.ui-accordion-content");
        
        [].forEach.call(tabs,
            (tab, ix) => (computedTabs.indexOf(ix) !== -1) && (tab.style.height = `${document.documentElement.clientHeight * 0.75}px`));
    }

    save(event, conference) {

        let conf:ConferenceModel = Object.assign({}, conference);
        conference.startDate && (conf.startDate = this.dateToUtcPipe.transform(conference.startDate));
        conference.endDate && (conf.endDate = this.dateToUtcPipe.transform(conference.endDate));

        delete conf["showScheme"];

        let method = conf.id ? "update" : "add";
        this.conferenceService[method](conf)
            .subscribe(
                id => {

                    if (method === "add")
                        this.id = id;

                    this.logger.info("Ok");
                },
                error => this.logger.error2(error));
    }

    schemeIdChange(value) {
        this.schemeId = value;
    }

    schemeLoaded() {

        [].forEach.call(this.members, m => (m.state === MemberState.Confirmed) && this.schemeMain.toggleMark(m.seat));

        this.seats = this.schemeMain
            .getMarkCodes()
            .map(c => <SelectItem>{ label: c, value: c });
    }

    showSchemeChange(value) {

        value && setTimeout(() => this.schemeMain.onResize(), 0);
    }
}