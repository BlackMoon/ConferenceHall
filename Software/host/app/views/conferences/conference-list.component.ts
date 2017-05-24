import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

    @Input()
    endDate: Date;

    @Input()
    startDate: Date;

    selectedConferenceIds: number[] = [];
    selectedState: ConfState = ConfState.Planned;
    
    conferences: ConferenceModel[];

    constructor(
        private conferrenceService: ConferenceService,
        private logger: Logger,
        private mediator: Mediator) {

        this.actions = [
            {
                label: 'Добавить',
                icon: 'fa-plus'
            },
            {
                label: 'Изменить',
                icon: 'fa-pencil'
            },
            {
                label: 'Удалить',
                icon: 'fa-trash'
            }
        ];
        
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
        
        this.conferrenceService
            .getAll(this.selectedState, this.startDate, this.endDate)
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error(error)); 
    }

    dragStart(event, conference) {
        event.dataTransfer.setData(confDragType, JSON.stringify(conference));
    }
    
    changeState(state: ConfState) {
        this.selectedState = state;

        this.conferrenceService
            .getAll(this.selectedState, this.startDate, this.endDate)
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error(error)); 

        this.selectedConferenceIds = [];
    }

    makeAppointment() {

        if (this.selectedConferenceIds.length > 0) {

            this.mediator.broadcast("conferenceList_makeAppointment",
                this.conferences
                    .filter(c => this.selectedConferenceIds.indexOf(c.id) !== -1));
        }
    }

    selectConference(conference) {
        conference.selected = !conference.selected;

        if (conference.selected)
            this.selectedConferenceIds.push(conference.id);
        else {
            let ix = this.selectedConferenceIds.indexOf(conference.id);
            this.selectedConferenceIds.splice(ix, 1);
        }
    }
}