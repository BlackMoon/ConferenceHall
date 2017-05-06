import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { ElementGroupCommand, ElementModel } from '../../models';
import { ElementService } from './element.service';

const dragOffset = "offset";
const dragType = "element";

@Component({
    selector: 'element-list',
    styleUrls: ['element-list.component.css'],
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent implements OnInit, OnDestroy  {
    
    elements: ElementModel[] = [];
    selectedElementIds: number[] = [];
    smallGrid: boolean;

    private subscription: Subscription = new Subscription();

    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute) {

        this.subscription.add(
            mediator
                .on<ElementGroupCommand>("elementList_addToFavorites")
                .flatMap((c:ElementGroupCommand) => this.elementService.addToFavorites(c))
                .subscribe(
                    _ => { },
                    error => this.logger.error(error))
        );

        this.subscription.add(
            mediator
                .on<ElementGroupCommand>("elementList_deleteElements")
                .flatMap((c:ElementGroupCommand) => this.elementService.delete(c))
                .subscribe((ids: number[]) => {
                       
                    for (let id of ids) {
                        let ix = this.elements.findIndex(e => e.id === id);
                        this.elements.splice(ix, 1);
                    }
                },
                error => this.logger.error(error))
        );

        this.subscription.add(
            mediator
                .on<boolean>("elementList_viewChanged")
                .subscribe(sm => this.smallGrid = sm,
                           error => this.logger.error(error))
        );
    }

    ngOnInit() {

        this.route.queryParams
            .switchMap((params: Params) => {

                let filter = params["f"];
                let groupid = +params["gid"]; // (+) converts string 'gid' to a number

                return this.elementService.getAll(filter, groupid);
            })
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }    

    dragStart(event, element) {
        
        let cr: ClientRect = event.currentTarget.getBoundingClientRect(),
            offsetX = event.clientX - cr.left,
            offsetY = event.clientY - cr.top;

        event.dataTransfer.setData(dragOffset, JSON.stringify({ x: offsetX, y: offsetY }));
        event.dataTransfer.setData(dragType, JSON.stringify(element));
    }

    selectElement(element) {
        element.selected = !element.selected;
        
        if (element.selected) 
            this.selectedElementIds.push(element.id);
        else {
            let ix = this.selectedElementIds.indexOf(element.id);
            this.selectedElementIds.splice(ix, 1);
        }
        
        this.mediator.broadcast("elementList_selectionChanged", this.selectedElementIds);
    }
}