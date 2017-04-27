import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Message } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Logger } from "./common/logger";

const startViewKey = 'returnUrl';

@Component({    
    selector: 'conferenceHall-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    msgs: Message[] = [];
    /**
     * Стартовая страница
     */
    private startView: string;    

    constructor(
        private logger: Logger,
        private router: Router)
    {
        this.startView = new URLSearchParams(window.location.search.slice(1)).get(startViewKey);
        
    }

    ngOnInit() {

        this.logger.msgReсeived.subscribe((msgs: Message[]) => this.msgs = msgs);

        // start page --> navigate
        if (this.startView != undefined)
            this.router.navigateByUrl(this.startView);
    }
}