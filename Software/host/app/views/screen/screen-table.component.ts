import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild, isDevMode } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Carousel } from "primeng/components/carousel/carousel";
import { Logger } from "../../common/logger";
import { ConfState, ScreenModel } from '../../models';
import { ScreenService } from './screen.service';

@Component({
    styleUrls: ["screen-table.component.css"],
    templateUrl: 'screen-table.component.html'
})
export class ScreenTableComponent implements OnInit {

    firstVisible: number;
    startDate: Date;
   
// ReSharper disable InconsistentNaming
    private _screens: ScreenModel[];

    public ConfState = ConfState;  
// ReSharper restore InconsistentNaming

    get screens(): ScreenModel[] {
        return this._screens;
    }

    set screens(screens: ScreenModel[]) {
        
        if (screens && screens.length) {

            let ix = screens.length - 1,
                prev = new Date(4000, 0, 0),
                now = new Date();

            screens.forEach((s, i) => {

                // startDate/endDate in string --> create date objects
                s.startDate = new Date(s.startDate);
                s.endDate = new Date(s.endDate);
                
                let diff = <any>s.endDate - <any>now; // in ms

                // endDate > now
                if (diff > 0) {
                    // search min startDate
                    if (s.startDate < <any>prev) {
                        prev = s.startDate;
                        ix = i;
                    }
                }
            });
            
            this.firstVisible = ix;    
        }
        
        this._screens = screens;
    }    

    constructor(
        private datePipe: DatePipe,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router,
        private screenService: ScreenService) { }
    
    ngOnInit() {

        this.route.params
            .switchMap((params: Params) => {

                this.startDate = new Date(params["startDate"]);

                if (isNaN(this.startDate.getTime()))
                    this.startDate = new Date();

                return this.screenService
                    .getAll(this.startDate);
            })
            .subscribe(screens => this.screens = screens);
    }

    addDays(days:number) {
        
        let d = this.startDate.getDate(),
            m = this.startDate.getMonth(),
            y = this.startDate.getFullYear();

        this.startDate = new Date(y, m, d + days);

        this.location.replaceState(`screens/${this.datePipe.transform(this.startDate, "yyyy-MM-dd")}`);
        this.loadScreens();
    }

    loadScreens() {

        this.screenService
            .getAll(this.startDate)
            .subscribe(
                screens => this.screens = screens,
                error => this.logger.error2(error)
        );    
    }

    openDesktop(id) {

        isDevMode() ? this.router.navigate(["screen", id]) : window.open(`/screen/${id}`, "_blank");
    }
}