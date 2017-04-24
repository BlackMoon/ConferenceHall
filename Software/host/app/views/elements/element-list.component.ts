import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-list',
    template: `
        elementlist
        `
})
export class ElementListComponent implements OnInit {

    elements: ElementModel[] = [
        { name: 'Добавить', code: 'add', icon: 'fa fa-plus' },
        { name: 'Избранное', code: 'favorite', icon: 'fa fa-star-o' }
    ];

    constructor(
        private elementService: ElementService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {
        
    }

    itemClick(name:string) {
        debugger;
    }

    removeElement(id: number, name?: string) {

        /*this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () =>

                this.hallService
                    .delete(id)
                    .subscribe(
                    _ => {

                        let ix = this.halls.findIndex(h => h.id === id);
                        this.halls.splice(ix, 1);
                    },
                    error => this.logger.error(error))

        });*/
    }
}