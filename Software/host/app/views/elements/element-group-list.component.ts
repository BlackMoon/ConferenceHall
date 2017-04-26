import { Component, EventEmitter, Output } from '@angular/core';

import { ElementGroupModel } from '../../models';

@Component({
    selector: 'element-group-list',
    template: `
        <p-dataList [value]="groups" [styleClass]="'h100p'">
            <ng-template let-element pTemplate="item">
                <div class="ui-grid ui-grid-responsive ui-widget-content">
                    <div class="ui-grid-row" [ngStyle]="{'cursor':'pointer', 'padding': '0.5em'}" (click)="itemClick(element)">
                        <div class="ui-grid-col-2">
                            <i class="{{element.icon}}"></i>
                        </div>
                        <div class="ui-grid-col-10">
                            <div class="ui-helper-clearfix">{{element.name}}</div>
                        </div>

                    </div>
                </div>
            </ng-template>
        </p-dataList>
        `
})
export class ElementGroupListComponent {

    groups: ElementGroupModel[] = [
        { name: 'Добавить', code: 'add', icon: 'fa fa-plus' },
        { name: 'Редактировать', code: 'edit', icon: 'fa fa-pencil' },
        { name: 'Избранное', code: 'favorite', icon: 'fa fa-star-half-o' }
    ];

    // event Handlers
    @Output() itemClicked: EventEmitter<ElementGroupModel> = new EventEmitter();
    

    itemClick = (group: ElementGroupModel) => this.itemClicked.emit(group);
}