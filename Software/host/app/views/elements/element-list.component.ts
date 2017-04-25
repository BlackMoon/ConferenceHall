import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent implements OnInit {

    elements: ElementModel[] = [];

    @Input()
    filter:string;

    @Input()
    group: string;

    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {
        this.elementService
            .getAll(this.filter, this.group)
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));
    }
}