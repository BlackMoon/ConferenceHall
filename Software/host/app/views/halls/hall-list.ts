import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HallService } from './hall.service';

@Component({
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {
    halls = [{ name: 'Создать', description: 'Новый халл' }];

    constructor(private hallService: HallService) { }

    ngOnInit() {
        
        this.hallService.get()
            .subscribe(halls => {
               
                this.halls = this.halls.concat(halls);
            });
    }

}