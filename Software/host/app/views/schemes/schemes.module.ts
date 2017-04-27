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
import { SchemeMainComponent } from './scheme-main.component';
import { SchemeListComponent } from "./scheme-list.component";
import { SchemeToolboxComponent } from './scheme-toolbox.component';
import { SchemeRoutingModule } from './schemes-routing.module';
import { SchemeService } from './scheme.service';


@NgModule({
    declarations: [SchemeDetailComponent, SchemeMainComponent, SchemeListComponent, SchemeToolboxComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, SchemeListComponent, SchemeMainComponent, SchemeToolboxComponent, SpinnerModule],
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
