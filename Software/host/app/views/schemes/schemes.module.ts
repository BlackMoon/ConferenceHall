import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    DragDropModule,
    DropdownModule,
    FieldsetModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    PanelModule,
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

import { ShapePropertiesComponent } from './shape-properties.component';

@NgModule({
    declarations: [SchemeDetailComponent, SchemeMainComponent, SchemeListComponent, SchemeToolboxComponent, ShapePropertiesComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, SchemeListComponent, SchemeMainComponent, SchemeToolboxComponent, ShapePropertiesComponent, SpinnerModule],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        DragDropModule,
        DropdownModule,
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
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule],
    providers: [SchemeService]
})
export class SchemesModule { }
