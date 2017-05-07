import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AutoCompleteModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    DragDropModule,
    FieldsetModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    PanelModule,
    SliderModule,
    SpinnerModule,
    TabViewModule,
    ToggleButtonModule,
    ToolbarModule
} from 'primeng/primeng';

import { ElementsModule } from "../elements/elements.module";
import { GroupsModule } from "../groups/groups.module";
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
        DragDropModule,
        ElementsModule,
        FieldsetModule,
        FormsModule,
        GroupsModule,
        InputTextModule,
        InputTextareaModule,
        MenuModule,
        PanelModule,
        ReactiveFormsModule,
        SchemeRoutingModule,
        SliderModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule],
    providers: [SchemeService]
})
export class SchemesModule { }
