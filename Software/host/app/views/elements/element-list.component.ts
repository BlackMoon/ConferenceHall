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
        
        let favorite = element.favorite;

        this.elementService
            .addToFavorite(element.id, !favorite)
            .subscribe(
                _ =>
                {
                    if (this.isFavoriteGroup() && favorite) {
                        let ix = this.elements.findIndex(el => el.id === element.id);
                        this.elements.splice(ix, 1);
                    }
                    element.favorite = !favorite;
                },
                error => this.logger.error(error)
            );
    }

    queryElements(filter?: string, group?: string) {

        this.group = group || "";

        this.elementService
            .getAll(filter, group)
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));    
    }
}