import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    DataTableModule,
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
import { SchemeTableComponent } from "./scheme-table.component";
import { SchemeToolboxComponent } from './scheme-toolbox.component';
import { SchemeRoutingModule } from './schemes-routing.module';
import { SchemeService } from './scheme.service';

import { ShapePropertiesComponent } from './shape-properties.component';

@NgModule({
    declarations: [SchemeDetailComponent, SchemeMainComponent, SchemeListComponent, SchemeTableComponent, SchemeToolboxComponent, ShapePropertiesComponent],
    exports: [
        SchemeListComponent,
        SchemeMainComponent,
        SchemeTableComponent,
        SchemeToolboxComponent,
        ShapePropertiesComponent
    ],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        DataTableModule,
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
