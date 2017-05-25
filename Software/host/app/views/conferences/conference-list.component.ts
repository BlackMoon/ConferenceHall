import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
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

    actionCommand: () => void;
    actionLabel: string;
    actionIcon: string;

    @Input()
    endDate: Date;

    @Input()
    startDate: Date;

    selectedConferenceId?: number;
    selectedState: ConfState = ConfState.Planned;
    
    conferences: ConferenceModel[];

    constructor(
        private conferrenceService: ConferenceService,
        private logger: Logger,
        private mediator: Mediator,
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
                    .getAll(this.selectedState, this.startDate, this.endDate)
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

    changeState(state: ConfState) {

        this.selectedState = state;

        this.conferrenceService
            .getAll(this.selectedState, this.startDate, this.endDate)
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error(error));

        this.actions = [];

        switch (state) {
            case ConfState.Planned:

                this.actions
                    .push({
                        label: 'Добавить',
                        icon: 'fa-plus',
                        routerLink: ['conferences/new']
                    },
                    {
                        label: 'Изменить',
                        icon: 'fa-pencil',
                        command: () => this.selectedConferenceId && this.router.navigate(['/conferences', this.selectedConferenceId])
                    });

                this.actionCommand = () => this.makeAppointment();
                this.actionLabel = "Назначить";
                this.actionIcon = "fa-calendar-times-o";

                break;

            case ConfState.Active:
            case ConfState.Closed:
            case ConfState.Preparing:

                this.actionCommand = () => this.selectedConferenceId && this.router.navigate(['/conferences', this.selectedConferenceId]);
                this.actionLabel = "Изменить";
                this.actionIcon = "fa-pencil";
                break;
        }

        this.actions
            .push({
                label: 'Удалить',
                icon: 'fa-trash',
                command: () => { this.selectedConferenceId && console.log('del'); }
            });

        this.selectedConferenceId = null;
    }

    dragStart(event, conference) {
        event.dataTransfer.setData(confDragType, JSON.stringify(conference));
    }
    
    makeAppointment() {

        if (this.selectedConferenceId) {

            this.mediator.broadcast("conferenceList_makeAppointment",
                this.conferences
                    .filter(c => c.id === this.selectedConferenceId));
        }
    }

    selectConference(conference) {

        if (!conference.selected) {

            for (let conf of this.conferences) {
                conf.selected = (conf.id === conference.id);
            }
            
            this.selectedConferenceId = conference.id;
        }
    }
}