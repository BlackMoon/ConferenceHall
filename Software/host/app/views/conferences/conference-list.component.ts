import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, confDragType } from '../../models';
import { ConferenceService } from './conference.service';

declare var $: any;

@Component({
    selector: "conference-list",
    templateUrl: 'conference-list.component.html'
})
export class ConferenceListComponent implements OnInit {

// ReSharper disable InconsistentNaming
    private _endDate: Date;
    private _startDate: Date;
// ReSharper restore InconsistentNaming

    actions: MenuItem[];
    states: any[];

    selectedConferenceIds: number[] = [];
    selectedState: ConfState = ConfState.Planned;
    
    conferences: ConferenceModel[];
    
    @Input()
    set startDate(date: Date) {

        this._startDate = date;

        this.conferrenceService
            .getAll(this.selectedState, this._startDate)
            .subscribe(
            conferences => this.conferences = conferences,
            error => this.logger.error(error));
    }

    constructor(
        private conferrenceService: ConferenceService,
        private el: ElementRef,
        private logger: Logger) {

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

    ngOnInit() {
        this.conferrenceService
            .getAll(this.selectedState, this._startDate, this._endDate)
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
            .getAll(this.selectedState, this._startDate, this._endDate)
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error(error));

        this.selectedConferenceIds = [];
    }

    makeAppointment() {
        
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