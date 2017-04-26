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
    ToggleButtonModule,
    ToolbarModule
} from 'primeng/primeng';

import { ElementsModule } from "../elements/elements.module";
import { SchemeDetailComponent } from "./scheme-detail.component";
import { SchemeListComponent } from "./scheme-list.component";
import { SchemeRoutingModule } from './schemes-routing.module';
import { SchemeService } from './scheme.service';


@NgModule({
    declarations: [SchemeDetailComponent, SchemeListComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, SchemeListComponent, SpinnerModule],
    imports: [
        AutoCompleteModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        ElementsModule,
        FieldsetModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        ReactiveFormsModule,
        SchemeRoutingModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule],
    providers: [SchemeService]
})
export class SchemesModule { }
