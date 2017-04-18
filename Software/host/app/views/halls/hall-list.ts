import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { HallService } from './hall.service';

@Component({
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {
    halls = [];

    constructor(private hallService: HallService,
        private router: Router) { }

    ngOnInit() {
        
        this.hallService.getAll()
            .subscribe(halls => {
                
                this.halls = [{ name: 'Создать', description: 'Новый халл' }]
                    .concat(halls);
            });
    }

    @HostListener('click', ['$event.target'])
    details() {
        debugger;
    }

}