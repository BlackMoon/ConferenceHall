import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { AddToFavoritesModel, ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    styleUrls: ['element-list.component.css'],
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent implements OnInit  {
    
    elements: ElementModel[] = [];
    selectedElementIds: number[] = [];
    smallGrid: boolean;

    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute) {

        mediator.notify("elementList_addToFavorites")
            .mergeMap((f:AddToFavoritesModel) => this.elementService.addToFavorites(f))
            .subscribe(
                (f: AddToFavoritesModel) =>
                {
                    if (!f.add) {

                        for (let id of f.ids) {
                            let ix = this.elements.findIndex(e => e.id === id);
                            this.elements.splice(ix, 1);
                        }

                    }
                },
                error => this.logger.error(error));

        mediator.notify("elementList_deleteElements")
            .subscribe((ids: number[]) => {

                for (let id of ids) {
                    let ix = this.elements.findIndex(e => e.id === id);
                    this.elements.splice(ix, 1);
                }    
            });

        mediator.notify("elementList_viewChanged")
            .subscribe(sm => this.smallGrid = sm);
    }

    ngOnInit() {

        this.route.queryParams
            .switchMap((params: Params) => {

                let filter = params["f"];
                let groupid = +params["gid"]; // (+) converts string 'id' to a number

                return this.elementService.getAll(filter, groupid);
            })
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));
    }

    selectElement(element) {
        element.selected = !element.selected;

        if (element.selected) 
            this.selectedElementIds.push(element.id);
        else {
            let ix = this.selectedElementIds.indexOf(element.id);
            this.selectedElementIds.splice(ix, 1);
        }
        
        this.mediator.send("elementList_selectionChanged", this.selectedElementIds);
    }
}