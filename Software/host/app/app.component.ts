import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

const startViewKey = 'returnUrl';

@Component({    
    selector: 'conferenceHall-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    /**
     * Стартовая страница
     */
    private startView: string;    

    constructor(private router: Router) {
        this.startView = new URLSearchParams(window.location.search.slice(1)).get(startViewKey);
    }

    ngOnInit() {
        // start page --> navigate
        if (this.startView != undefined)
            this.router.navigateByUrl(this.startView);
    }
}