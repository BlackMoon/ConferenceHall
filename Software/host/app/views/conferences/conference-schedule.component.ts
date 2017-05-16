import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from 'primeng/components/schedule/schedule';
import { Logger } from "../../common/logger";
import { ConferenceService } from './conference.service';

@Component({
    host: { '(window:resize)': "onResize($event)" },
    templateUrl: 'conference-schedule.component.html'
})
export class ConferenceScheduleComponent implements OnInit {
    

    constructor(private conferrenceService: ConferenceService) {
    }

    ngOnInit() {
        
    }
}