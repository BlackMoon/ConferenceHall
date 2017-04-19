import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HallModel } from '../../models';
import { HallService } from './hall.service';


@Component({
    styleUrls: [`hall-list.css`],
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {

    halls: HallModel[] = [{ name: 'Создать', description: 'Новый халл' }];

    constructor(private hallService: HallService) { }

    ngOnInit() {

        this.hallService
            .getAll()
            .subscribe(halls => this.halls = this.halls.concat(halls));
    }

    removeHall(id:number) {

        this.hallService
            .delete(id)
            .subscribe(_ => {
                let ix = this.halls.findIndex(h => h.id === id);
                this.halls.slice(ix, 1);
            });

        
    }
}