import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from 'primeng/components/schedule/schedule';
import { Logger } from "../../common/logger";
import { ConferenceService } from './conference.service';

@Component({
    templateUrl: 'conference-schedule.component.html'
})
export class ConferenceScheduleComponent implements OnInit {

    headerConfig: any;

    constructor(private conferrenceService: ConferenceService) {

        this.headerConfig = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        };

    }

    ngOnInit() {
        
    }
}