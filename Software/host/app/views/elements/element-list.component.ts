import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent  {

    elements: ElementModel[] = [];

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