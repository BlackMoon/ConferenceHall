import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HallService } from './hall.service';

@Component({
    styles: [
        `.logo {
            background: url('images/office_48x48.png');
        }`
    ],
    templateUrl: 'hall-list.html'
})
export class HallListComponent implements OnInit {
    halls = [];

    constructor(private hallService: HallService) { }

    ngOnInit() {
        
        this.hallService.get()
            .subscribe(halls => this.halls = halls);
    }

}