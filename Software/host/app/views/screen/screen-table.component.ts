import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Logger } from "../../common/logger";
import { ConfState, ScreenModel } from '../../models';
import { ScreenService } from './screen.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [".carousel .ui-grid-row { text-align: center; }"],
    templateUrl: 'screen-table.component.html'
})
export class ScreenTableComponent implements OnInit {

    activeDate: Date = new Date();
    screens: ScreenModel[];

    // ReSharper disable once InconsistentNaming
    public ConfState = ConfState;    
    
    constructor(
        private logger: Logger,
        private screenService: ScreenService) { }
    
    ngOnInit() {
        this.loadScreens();
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
                screens => this.screens = screens,
                error => this.logger.error2(error)
        );    
    }
}