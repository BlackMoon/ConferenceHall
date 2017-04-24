import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-detail',
    template: ` new`
})
export class ElementDetailComponent implements OnInit {
    
    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {

    }
}