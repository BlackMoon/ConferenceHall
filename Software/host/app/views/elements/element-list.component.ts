import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

const favoriteGroup = "favorite";

@Component({
    selector: 'element-list',
    styleUrls: ['element-list.component.css'],
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent  {

    group: string;
    elements: ElementModel[] = [];

    @Input()
    smallGrid: boolean;

    constructor(
        private elementService: ElementService,
        private logger: Logger) { }

    /**
     * Отображается группа [Избранное]?
     */
    isFavoriteGroup = () => this.group.toLowerCase() === favoriteGroup;

    favoriteClick(element) {
        debugger;

        if (this.isFavoriteGroup() && element.favorite) {
            let ix = this.elements.findIndex(el => el.id === element.id);
            this.elements.splice(ix, 1);
        }

        element.favorite = !element.favorite;
    }

    queryElements(filter?: string, group?: string) {

        this.group = group || "";

        this.elementService
            .getAll(filter, group)
            .subscribe(
                elements => {
                    elements.forEach(el => el.favorite = this.isFavoriteGroup());
                    this.elements = elements;
                },
                error => this.logger.error(error));    
    }
}