import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Logger } from "../common/logger";
import { ScreenModel } from '../models';
import { ScreenService } from './screen/screen.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [".ui-grid-row { text-align: center; }"],
    templateUrl: 'home.view.html'
})
export class HomeView implements OnInit {

    screens: ScreenModel[];
    
    constructor(
        private logger: Logger,
        private screenService: ScreenService) { }


    ngOnInit() {
        this.screenService
            .getAll()
            .subscribe(
                screens => this.screens = screens,
                error => this.logger.error2(error)
            );
    }
}