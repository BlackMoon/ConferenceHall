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

@NgModule({
    declarations: [],
    exports: [],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        DataTableModule,
        DragDropModule,
        DropdownModule,       
        FieldsetModule,
        FormsModule,      
        InputTextModule,
        InputTextareaModule,
        
        MenuModule,
        
        PanelModule,
        ReactiveFormsModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule
    ]
})
export class EmployeesModule { }
