import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HallService } from './hall.service';


@Component({
    styleUrls: [`hall-list.css`],
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {

    halls = [{ name: '1', size: {w:1, h:2} }];

    constructor(private hallService: HallService) { }

    ngOnInit() {
        debugger;

        //Reflect.metadata

        this.hallService.getAll()
            .subscribe(halls => {
                debugger;
                /*this.halls = [{ name: 'Создать', description: 'Новый халл' }]
                    .concat(halls);*/
            });
    }
}