import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { SchemeModel } from '../../models/index';
import { SchemeService } from './scheme.service';

const modelRoute = 'scheme';

@Component({
    selector: 'scheme-list',
    template: `
        <p-dataList [value]="items" [rows]="10">
            <ng-template let-scheme pTemplate="item">
                <div class="ui-grid ui-grid-responsive ui-fluid"  style="font-size:16px;padding:20px;border-bottom:1px solid #D5D5D5;">
                    <div class="ui-grid-row">
                        <div class="ui-grid-col-1">
                            <i class="fa fa-object-group" (click)="editScheme(scheme.id)" style="cursor: pointer;" title="Редактор"></i>
                        </div>
                        <div class="ui-grid-col-10">
                            {{scheme.name}}
                        </div>
                        <div class="ui-grid-col-1">
                            <i class="fa fa-trash" (click)="removeScheme(scheme.id, scheme.name)" style="cursor: pointer;" title="Удалить"></i>
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-dataList>`
})
export class SchemeListComponent {

    @Input()
    items: SchemeModel[];

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private schemeService: SchemeService) { }

    editScheme(id?: number) {

        let commands: any[] = [modelRoute];
        (id) && commands.push(id);

        this.router.navigate(commands);
    }

    removeScheme(id: number, name?: string) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () =>

                this.schemeService
                    .delete(id)
                    .subscribe(
                    _ => {

                        let ix = this.items.findIndex(s => s.id === id);
                        this.items.splice(ix, 1);
                    },
                    error => console.log(error))

        });   
    }
}