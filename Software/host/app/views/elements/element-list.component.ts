import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    styleUrls: ['element-list.component.css'],
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent  {

    elements: ElementModel[] = [];

    @Input()
    smallGrid: boolean;

    constructor(
        private elementService: ElementService,
        private logger: Logger) { }

    queryElements(filter?: string, group?: string) {
        
        this.elementService
            .getAll(filter, group)
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));    
    }
}