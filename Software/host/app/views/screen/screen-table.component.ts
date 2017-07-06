import { Component, OnInit, ViewEncapsulation, isDevMode } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConfState, ScreenModel } from '../../models';
import { ScreenService } from './screen.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [".carousel .ui-grid-row { text-align: center; }", ".font_1 { font-size: 1.5em; font-weight: 600 }"],
    templateUrl: 'screen-table.component.html'
})
export class ScreenTableComponent implements OnInit {

    activeDate: Date = new Date();
    firstVisible: number = 1;
    screens: ScreenModel[];

    // ReSharper disable once InconsistentNaming
    public ConfState = ConfState;    
    
    constructor(
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router,
        private screenService: ScreenService) { }
    
    ngOnInit() {
        this.loadScreens();

        this.route.params
            .switchMap((params: Params) => {
                return Observable.empty();
            })
            .subscribe();
    }

    addDays(days:number) {
        
        let d = this.activeDate.getDate(),
            m = this.activeDate.getMonth(),
            y = this.activeDate.getFullYear();

        this.activeDate = new Date(y, m, d + days);

        this.loadScreens();
    }

    loadScreens() {

        this.screenService
            .getAll(this.activeDate)
            .subscribe(
                screens => {

                    let ix,
                        prev = new Date(4000, 0, 0),
                        now = new Date();
                  
                    screens.forEach((s, i) => {
                        
                        // startDate/endDate in string --> create date objects
                        let start = new Date(s.startDate),
                            end = new Date(s.endDate),
                            diff = <any>end - <any>now;         // in ms

                        // endDate > now
                        if (diff > 0) {
                            // search min startDate
                            if (start < prev) {
                                prev = start;
                                ix = i;
                            }
                        } 
                    });
                    this.firstVisible = ix + 1;
                    this.screens = screens;
                    
                },
                error => this.logger.error2(error)
        );    
    }

    openDesktop(id) {

        isDevMode() ? this.router.navigate(["screens", id]) : window.open(`/screens/${id}`, "_blank");
    }
}