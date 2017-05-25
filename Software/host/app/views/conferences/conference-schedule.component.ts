import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { AppointmentDialogComponent } from "./appointment-dialog.component";
import { AppointmentModel, ConferenceModel, confDragType, TimeRange } from '../../models';
import { ConferenceService } from './conference.service';
import { ConferenceListComponent } from "./conference-list.component";

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [`.p0501 .ui-tabview-panel { padding: 0.5em 0.1em; }`],
    templateUrl: 'conference-schedule.component.html'
})
export class ConferenceScheduleComponent implements OnInit, OnDestroy {

    @ViewChild(AppointmentDialogComponent) appointmentDialog: AppointmentDialogComponent;

    events: any[];
    headerConfig: any;

    endDate: Date;
    startDate: Date;
    
    selectedConference: ConferenceModel;

    private subscription: Subscription = new Subscription();

    constructor(
        private conferrenceService: ConferenceService,
        private logger: Logger,
        private mediator: Mediator) {

        this.headerConfig = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        };

        this.subscription.add(
            mediator
                .on<ConferenceModel>("conferenceList_makeAppointment")
                .subscribe(conf => {
                    // conferences.length всегда > 0 !
                    this.appointmentDialog.show(<any>{ hallId: conf.hallId, start: new Date() });
                    this.selectedConference = conf;
                })
        );
    }

    ngOnInit() {
        this.events = [
            {
                "title": "All Day Event",
                "start": "2017-05-01"
            },
            {
                "title": "Long Event",
                "start": "2017-05-07",
                "end": "2017-05-10"
            },
            {
                "title": "Repeating Event",
                "start": "2017-05-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2017-05-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2017-05-11",
                "end": "2017-05-13"
            }
        ];
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    appointmentDialogClosed(appointment: AppointmentModel) {
        
        if (appointment) {

            //this.selectedConference.dateStart = appointment.start;
            //this.selectedConference.dateEnd = new Date(appointment.start.getTime() + appointment.duration.getTime());
            this.selectedConference.hallId = appointment.hallId;

            this.conferrenceService
                .makeAppointment(this.selectedConference)
                .subscribe(
                    (range:TimeRange) => {
                            this.events.push(
                            {
                                title: this.selectedConference.subject,
                                start: range.dateStart,
                                end: range.dateEnd
                            });
                        
                    },
                    error => this.logger.error(error)
            );
        }
    }

    drop(date, event) {
        debugger;
        //let conference = JSON.parse(event.dataTransfer.getData(confDragType));
    }

    eventDrop(event) {
        debugger;
    }

    viewRender(event) {
        this.startDate = event.view.start.toDate(),
        this.endDate = event.view.end.toDate();
    }
}