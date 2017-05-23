import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConferenceModel, confDragType } from '../../models';
import { ConferenceService } from './conference.service';

@Component({
    styleUrls: [`conference-schedule.component.css`],
    templateUrl: 'conference-schedule.component.html'
})
export class ConferenceScheduleComponent implements OnInit {

    events: any[];
    headerConfig: any;

    constructor(private conferrenceService: ConferenceService) {

        this.headerConfig = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        };

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

    drop(date, event) {
        debugger;
        //let conference = JSON.parse(event.dataTransfer.getData(confDragType));
    }

    eventDrop(event) {
        debugger;
    }

    viewRender(event) {
        debugger;
    }
}