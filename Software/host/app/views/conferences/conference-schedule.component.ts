import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Logger } from "../../common/logger";
import { Schedule } from "primeng/components/schedule/schedule";
import { AppointmentDialogComponent } from "./appointment-dialog.component";
import { AppointmentModel, ConferenceModel, confDragType, TimeRange } from '../../models';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { ConferenceService } from './conference.service';
import { ConferenceListComponent } from "./conference-list.component";

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [`.p0501 .ui-tabview-panel { padding: 0.5em 0.1em; }`],
    templateUrl: 'conference-schedule.component.html'
})
export class ConferenceScheduleComponent {

    @ViewChild(AppointmentDialogComponent) appointmentDialog: AppointmentDialogComponent;
    @ViewChild(ConferenceListComponent) conferenceList: ConferenceListComponent;

    events: any[];
    headerConfig: any;
    menuItems: MenuItem[];

    endDate: Date;
    startDate: Date;
    
    selectedConference: ConferenceModel;
    selectedEvent: any;

    constructor(
        private conferrenceService: ConferenceService,
        private confirmationService: ConfirmationService,
        private logger: Logger,
        private router: Router) {

        this.headerConfig = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        };

        this.menuItems = [
            {
                label: "Изменить",
                icon: "fa-pencil",
                command: () => this.router.navigate(["/conferences", this.selectedEvent.id])
            },
            {
                label: "Удалить",
                icon: "fa-trash",
                command: () => {
                    this.confirmationService.confirm({
                        header: 'Вопрос',
                        icon: 'fa fa-trash',
                        message: `Удалить [${this.selectedEvent.title}]?`,
                        accept: _ => {
                            return this.conferrenceService
                                .delete(this.selectedEvent.id)
                                .subscribe(
                                    _ => {
                                        let ix = this.events.findIndex(c => c.id === this.selectedEvent.id);
                                        this.events.splice(ix, 1);
                                        this.selectedEvent = null;
                                    },
                                    error => this.logger.error(error));
                        }
                    });
                }
            }];
        
    }

    appointmentDialogClosed(appointment: AppointmentModel) {
        
        if (appointment != null) {
            
            appointment.conferenceId = this.selectedConference.id;

            this.conferrenceService
                .makeAppointment(appointment)
                .subscribe(
                    (period:TimeRange) => {
                        
                        this.events.push(
                            {
                                id: this.selectedConference.id,
                                title: this.selectedConference.subject,
                                start: period.lowerBound,
                                end: period.upperBound
                            });
                        this.conferenceList.removeConferenceFromList(this.selectedConference.id);
                        this.selectedConference = null;
                    },
                    error =>
                    {
                        this.selectedConference = null;
                        this.logger.error(error);
                    }
            );
        }
    }

    drop(date, event) {
        debugger;
        //let conference = JSON.parse(event.dataTransfer.getData(confDragType));
    }

    eventDrop(e) {

        let appointment: AppointmentModel = { conferenceId: e.event.id, start: e.event.start.toDate(), end: e.event.end.toDate() };

        this.conferrenceService
            .changePeriod(appointment)
            .subscribe(
                _ => {},
                error => {
                    e.revertFunc.call();
                    this.logger.error(error);
                });
        
    }

    eventResize(e) {

        let appointment: AppointmentModel = { conferenceId: e.event.id, start: e.event.start.toDate(), end: e.event.end.toDate() };

        this.conferrenceService
            .changePeriod(appointment)
            .subscribe(
                _ => {},
                error => {
                    e.revertFunc.call();
                    this.logger.error(error);
                });
    }

    makeAppointment(conference) {

        // time period like schedule's view period
        let renderedDays:number = (<any>this.endDate - <any>this.startDate) / 864e5,
            calendarVisible = (renderedDays !== 1),
            date = this.startDate.getDate(),
            month = this.startDate.getMonth();

        if (renderedDays >= 28 && this.startDate.getDate() > 20)
        {
            // show next month
            date = 1;
            month++;
        }
        
        this.selectedConference = conference;
        this.appointmentDialog.show(<any>{ hallId: this.selectedConference.hallId, start: new Date(this.startDate.getFullYear(), month, date) }, calendarVisible);    
    }

    viewRender(event) {
        this.startDate = event.view.start.toDate();
        this.endDate = event.view.end.toDate();

        this.conferrenceService
            .getAll(this.startDate, this.endDate)
            .subscribe(
                conferences => this.events = conferences.map(c => <any>{ id: c.id, start: c.startDate, end: c.endDate, title: c.subject }),
                error => this.logger.error(error));
    }
}