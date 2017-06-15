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

import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeService } from './employee.service';

@NgModule({
    declarations: [EmployeeDetailComponent],
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
        EmployeeRoutingModule,
        MenuModule,        
        PanelModule,
        ReactiveFormsModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule
    ],
    providers: [EmployeeService]
})
export class EmployeesModule { }
