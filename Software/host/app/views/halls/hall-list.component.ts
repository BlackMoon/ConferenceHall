import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { HallModel } from '../../models';
import { HallService } from './hall.service';

@Component({
    selector: 'hall-list',
    templateUrl: 'hall-list.component.html'
})
export class HallListComponent implements OnInit {

    halls: HallModel[];
    selectedHallIds: number[] = [];

    @Output() selectionChanged = new EventEmitter<number[]>();

    constructor(
        private hallService: HallService,
        private logger: Logger) {}

    ngOnInit() {

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls,
                error => this.logger.error2(error));
    }

    selectHall(hall) {
        hall.selected = !hall.selected;

        if (hall.selected)
            this.selectedHallIds.push(hall.id);
        else {
            let ix = this.selectedHallIds.indexOf(hall.id);
            this.selectedHallIds.splice(ix, 1);
        }

        this.selectionChanged.emit(this.selectedHallIds);
    }
}