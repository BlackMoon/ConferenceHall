import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HallService } from './hall.service';

@Component({
    styleUrls: [`hall-list.css`],
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {

    halls = [{ name: 'Создать', description: 'Новый халл' }];

    constructor(private hallService: HallService) { }

    ngOnInit() {

        this.hallService
            .getAll()
            .subscribe(halls => this.halls = this.halls.concat(halls));
    }
}