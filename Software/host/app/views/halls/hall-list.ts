import { Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';
import { Observable } from 'rxjs';
import { HallService } from './hall.service';

const selector = '.ui-panel';

@Component({
    styleUrls: [`hall-list.css`],
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {

    halls = [{ name: 'Создать', description: 'Новый халл' }];

    constructor(
        private elementRef: ElementRef,
        private hallService: HallService,
        private renderer: Renderer) {
    }

    ngOnInit() {

        this.hallService
            .getAll()
            .subscribe(halls => this.halls = this.halls.concat(halls));
    }

    click() {
        debugger;
    }
}