import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AutoCompleteModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    FieldsetModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
    SpinnerModule,
    TabViewModule,
    ToolbarModule
} from 'primeng/primeng';

import { ElementGroupListComponent } from "./element-group-list.component";
import { ElementDetailComponent } from "./element-detail.component";
import { ElementListComponent } from "./element-list.component";
import { ElementService } from './element.service';


@NgModule({
    declarations: [ElementDetailComponent, ElementListComponent, ElementGroupListComponent],
    exports: [ElementDetailComponent, ElementListComponent, ElementGroupListComponent],
    imports: [CommonModule, DataListModule],
    providers: [ElementService]
})
export class ElementsModule { }