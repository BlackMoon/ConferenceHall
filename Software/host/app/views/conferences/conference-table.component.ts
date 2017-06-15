import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ConferenceModel, ConfState, confDragType } from '../../models';
import { ConferenceService } from './conference.service';

@Component({
    selector: "conference-table",
    templateUrl: "conference-table.component.html"
})
export class ConferenceTableComponent implements OnInit, OnChanges {
    
    states: any[];

    /**
     * Активная команда splitButton'a    
     */
    actionCommand: () => void;
    actionLabel: string;
    actionIcon: string;

    editMode: boolean;

    @Input()
    endDate: Date;

    @Input()
    startDate: Date;
   
    selectedConference: ConferenceModel;
    selectedState: ConfState = ConfState.Planned;

    @Output() appointmentButtonClick = new EventEmitter<ConferenceModel>();
    @Output() conferenceRemoveClick = new EventEmitter<number>();

    conferences: ConferenceModel[];

    public ConfState = ConfState;

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
                        error => this.logger.error2(error));
            }
        }
    }

    ngOnInit() {
        this.changeState(this.selectedState);
    }

    actionClick = () => this.actionCommand();

    addConferenceToList = (conference: ConferenceModel) => this.conferences.push(conference);

    changeEditMode() {
        this.editMode = !this.editMode;
    }

    changeState(state: ConfState) {

        this.selectedState = state;

        this.conferrenceService
            .getAll(this.startDate, this.endDate, this.selectedState)
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error2(error));

        this.selectedConference = null;
    }

    dragStart(e, conference) {
        e.currentTarget.click();
        e.dataTransfer.setData(confDragType, JSON.stringify(conference));
    }

    editConference(e, id: number) {
        e.stopPropagation();
        this.router.navigate(["/conferences", id]);
    }

    makeAppointment = () => this.appointmentButtonClick.emit(this.selectedConference);

    removeConference() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${this.selectedConference.subject}]?`,
            accept: _ => {
                return this.conferrenceService
                    .delete(this.selectedConference.id)
                    .subscribe(
                        _ => this.removeConferenceFromList(this.selectedConference.id),
                        error => this.logger.error2(error));
            }
        });
    }

    /**
     * Удаляет конференцию из списка
     * @param id 
     * @param emit     
     */
    removeConferenceFromList(id, emit: boolean = true) {

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