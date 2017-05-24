import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { AppointmentDialogComponent } from "./appointment-dialog.component";
import { ConferenceModel, confDragType } from '../../models';
import { ConferenceService } from './conference.service';
import { ConferenceListComponent } from "./conference-list.component";

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [`.p0501 .ui-tabview-panel { padding: 0.5em 0.1em; }`],
    templateUrl: 'conference-schedule.component.html'
})
export class ConferenceScheduleComponent implements OnInit {

    @ViewChild(AppointmentDialogComponent) appointmentDialog: AppointmentDialogComponent;

    events: any[];
    headerConfig: any;

    endDate: Date;
    startDate: Date;

    selectedConferences: ConferenceModel[];

    constructor(
        private conferrenceService: ConferenceService,
        private mediator: Mediator) {

        this.headerConfig = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        };

        this.mediator
            .on<ConferenceModel[]>("conferenceList_makeAppointment")
            .subscribe(conferences => {
                this.appointmentDialog.show();
                this.selectedConferences = conferences;
            });
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

    appointmentDialogClosed(result) {
        
        if (result) {
            debugger;        
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