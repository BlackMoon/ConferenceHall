import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { GlobalsModule } from '../../common/globals/globals.module';

import {
    AutoCompleteModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    DragDropModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
    SpinnerModule,
    TabViewModule,
    ToolbarModule
} from 'primeng/primeng';

import { ElementDetailComponent } from "./element-detail.component";
import { ElementListComponent } from "./element-list.component";
import { ElementService } from "./element.service";

@NgModule({
    declarations: [ElementDetailComponent, ElementListComponent],
    exports: [ElementDetailComponent, ElementListComponent],
    imports: [
        ButtonModule,
        CommonModule,
        GlobalsModule,
        DataGridModule,
        DataListModule,
        DragDropModule,
        FileUploadModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        SpinnerModule
    ],
    providers: [ElementService]
})
export class ElementsModule { }