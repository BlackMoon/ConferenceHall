import { Component, ViewChild } from '@angular/core';
import { ButtonItem, GroupModel } from '../../models';
import { ElementListComponent } from "../elements/element-list.component";

/**
 * min кол-во символов фильтра
 */
const minChars = 3;

/**
 * Операции 
 */
enum Operation { Edit, Group, Filter, New, Scheme };

@Component({
    template: `
    <div style="position: absolute; left: -200px; height: 600px; width: 1400px">
    
        <div class="ui-g h100p">
            <div class="ui-g-2 ui-md-2 ui-widget-content ui-g-nopad">
                <scheme-toolbox></scheme-toolbox>
            </div>
            <div class="ui-g-10 ui-md-10 ui-widget-content ui-g-nopad">
                <scheme-main></scheme-main>
            </div>
        </div>

    </div>`
})
export class SchemeDetailComponent {
    
}