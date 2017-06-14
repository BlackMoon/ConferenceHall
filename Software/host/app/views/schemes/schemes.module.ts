import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    DataTableModule,
    DragDropModule,
    DropdownModule,
    InputTextModule,
    MenuModule,
    SpinnerModule,
    ToggleButtonModule,
    ToolbarModule
} from 'primeng/primeng';

import { ElementsModule } from "../elements/elements.module";
import { GroupsModule } from "../groups/groups.module";
import { SchemeDetailComponent } from "./scheme-detail.component";
import { SchemeMainComponent } from './scheme-main.component';
import { SchemeTableComponent } from "./scheme-table.component";
import { SchemeToolboxComponent } from './scheme-toolbox.component';
import { SchemeRoutingModule } from './schemes-routing.module';
import { SchemeService } from './scheme.service';

import { ShapePropertiesComponent } from './shape-properties.component';

@NgModule({
    declarations: [SchemeDetailComponent, SchemeMainComponent, SchemeTableComponent, SchemeToolboxComponent, ShapePropertiesComponent],
    exports: [
        SchemeMainComponent,
        SchemeTableComponent,
        SchemeToolboxComponent,
        ShapePropertiesComponent
    ],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataTableModule,
        DragDropModule,
        DropdownModule,
        ElementsModule,
        FormsModule,
        GroupsModule,
        InputTextModule,
        MenuModule,
        ReactiveFormsModule,
        SchemeRoutingModule,
        SpinnerModule,
        ToggleButtonModule,
        ToolbarModule],
    providers: [SchemeService]
})
export class SchemesModule { }
