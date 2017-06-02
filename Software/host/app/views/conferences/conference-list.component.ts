import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, confDragType } from '../../models';
import { ConferenceService } from './conference.service';

declare var $: any;

@Component({
    selector: "conference-list",
    templateUrl: "conference-list.component.html"
})
export class ConferenceListComponent implements OnInit, OnChanges {
    
    actions: MenuItem[];
    states: any[];

    /**
     * Активная команда splitButton'a    
     */
    actionCommand: () => void;
    actionLabel: string;
    actionIcon: string;

    @Input()
    endDate: Date;

    @Input()
    startDate: Date;

    @Input()
    selectedConference: ConferenceModel;
    selectedState: ConfState = ConfState.Planned;

    @Output() appointmentButtonClick = new EventEmitter<ConferenceModel>();
    @Output() conferenceRemoveClick = new EventEmitter<number>();

    conferences: ConferenceModel[];

    constructor(
        private conferrenceService: ConferenceService,
        private confirmationService: ConfirmationService,
        private logger: Logger,
        private router: Router) {
        
        let stateKeys = Object
            .keys(ConfState)
            .filter(k => typeof ConfState[k] !== "function");

        this.states = stateKeys
            .slice(stateKeys.length / 2)
            .map(k => {
                    let state = ConfState[k];
                    return <any>
                    {
                        label: ConfState.toName(state),
                        value: state
                    }
                }
            );
    }
    
    ngOnChanges(changes: SimpleChanges) {
        
        let startDateChange = changes["startDate"],
            endDateChange = changes["endDate"];

        if (startDateChange.currentValue !== startDateChange.previousValue &&
            endDateChange.currentValue !== endDateChange.previousValue) {

            if (this.selectedState !== ConfState.Planned) {
                this.conferrenceService
                    .getAll(this.startDate, this.endDate, this.selectedState)
                    .subscribe(
                        conferences => this.conferences = conferences,
                        error => this.logger.error(error));
            }
        }
    }

    ngOnInit() {
        this.changeState(this.selectedState);
    }

    actionClick = () => this.actionCommand();

    addConferenceToList = (conference: ConferenceModel) => this.conferences.push(conference);

    changeState(state: ConfState) {

        this.selectedState = state;

        this.conferrenceService
            .getAll(this.startDate, this.endDate, this.selectedState)
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error(error));

        this.actions = [];

        switch (state) {
            case ConfState.Planned:

                this.actions
                    .push({
                        label: "Добавить",
                        icon: "fa-plus",
                        routerLink: ["conferences/new"]
                    },
                    {
                        label: "Изменить",
                        icon: "fa-pencil",
                        command: () => this.selectedConference && this.router.navigate(["/conferences", this.selectedConference.id])
                    });

                this.actionCommand = () => this.makeAppointment();
                this.actionLabel = "Назначить";
                this.actionIcon = "fa-calendar-times-o";

                break;

            case ConfState.Active:
            case ConfState.Closed:
            case ConfState.Preparing:

                this.actionCommand = () => this.selectedConference && this.router.navigate(["/conferences", this.selectedConference.id]);
                this.actionLabel = "Изменить";
                this.actionIcon = "fa-pencil";
                break;
        }

        this.actions
            .push({
                label: "Удалить",
                icon: "fa-trash",
                command: () => { this.selectedConference && this.removeConference(this.selectedConference); }
            });

        this.selectedConference = null;
    }

    dragStart(event, conference) {
        event.dataTransfer.setData(confDragType, JSON.stringify(conference));
    }
    
    makeAppointment() {
        (this.selectedConference) && this.appointmentButtonClick.emit(this.selectedConference);
    }

    removeConference(conference: ConferenceModel) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${conference.subject}]?`,
            accept: _ => {
                return this.conferrenceService
                    .delete(conference.id)
                    .subscribe(
                        _ => this.removeConferenceFromList(conference.id),
                        error => this.logger.error(error));
            }
        });
    }
    
    /**
     * Удаляет конференцию из списка
     * @param id 
     * @param emit     
     */
    removeConferenceFromList(id, emit:boolean = true) {
        
        this.selectedConference = null;

        let ix = this.conferences.findIndex(c => c.id === id);
        this.conferences.splice(ix, 1);

        emit && this.conferenceRemoveClick.emit(id);
    } 

    selectConference(conference) {

        if (!conference.selected) {

            for (let conf of this.conferences) {
                conf.selected = (conf.id === conference.id);
            }
            
            this.selectedConference = conference;
        }
    }
}