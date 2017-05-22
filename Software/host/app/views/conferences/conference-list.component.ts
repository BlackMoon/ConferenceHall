import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConferenceModel, confDragType } from '../../models';
import { ConferenceService } from './conference.service';

@Component({
    selector: "conference-list",
    templateUrl: 'conference-list.component.html'
})
export class ConferenceListComponent implements OnInit {

    conferences: ConferenceModel[];

    constructor(
        private conferrenceService: ConferenceService,
        private logger: Logger) {
    }

    ngOnInit() {
        this.conferrenceService
            .getAll()
            .subscribe(
                conferences => this.conferences = conferences,
                error => this.logger.error(error));
    }

    dragStart(event, conference) {
        event.dataTransfer.setData(confDragType, JSON.stringify(conference));
    }

    selectConference(conference) {
        conference.selected = !conference.selected;
        
    }
}