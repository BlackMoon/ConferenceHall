import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    styleUrls: ['element-list.component.css'],
    templateUrl: 'element-list.component.html'
})
export class ElementListComponent implements OnInit  {
    
    elements: ElementModel[] = [];
    
    smallGrid: boolean;

    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute) {

        mediator.notify("elementList_viewChanged")
            .subscribe(sm => this.smallGrid = sm);
    }

    ngOnInit() {

        this.route.queryParams
            .switchMap((params: Params) => {

                let filter = params["filter"];
                let groupid = +params["groupid"]; // (+) converts string 'id' to a number

                return this.elementService.getAll(filter, groupid);
            })
            .subscribe(
                elements => this.elements = elements,
                error => this.logger.error(error));
    }
}