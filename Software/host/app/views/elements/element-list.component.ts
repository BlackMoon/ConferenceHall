import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    template: `{{filter}}
        <p-dataGrid [value]="elements">
            <ng-template let-element pTemplate="item">
                <div class="ui-g-12 ui-md-4">
                    {{element.name}}
                </div>
            </ng-template>
        </p-dataGrid>
        `
})
export class ElementListComponent implements OnInit {

    elements: ElementModel[] = [];

    @Input()
    filter:string;

    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {
        this.elementService
            .getAll()
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));
    }
}