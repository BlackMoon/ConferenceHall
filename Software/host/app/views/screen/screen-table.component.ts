import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation, isDevMode } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Carousel } from "primeng/components/carousel/carousel";
import { Logger } from "../../common/logger";
import { ConfState, ScreenModel } from '../../models';
import { ScreenService } from './screen.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [".carousel .ui-grid-row { text-align: center; }", ".font_1 { font-size: 1.5em; font-weight: 600 }"],
    templateUrl: 'screen-table.component.html'
})
export class ScreenTableComponent implements OnInit {
    
    screens: ScreenModel[];
    startDate: Date;

    // ReSharper disable once InconsistentNaming
    public ConfState = ConfState;  

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
            .subscribe(
                screens => this.screens = screens,
                error => this.logger.error2(error));
    }

    addDays(days:number) {
        
        let d = this.startDate.getDate(),
            m = this.startDate.getMonth(),
            y = this.startDate.getFullYear();

        this.startDate = new Date(y, m, d + days);

        this.loadScreens();
    }

    loadScreens() {

        this.location.replaceState(`screens/${this.datePipe.transform(this.startDate, "yyyy-MM-dd")}`);

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