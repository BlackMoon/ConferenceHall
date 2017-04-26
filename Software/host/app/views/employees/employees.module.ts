import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataTableModule, AutoCompleteModule, ButtonModule, DataGridModule, DataListModule, FieldsetModule, InputTextModule, InputTextareaModule, PanelModule, SpinnerModule, TabViewModule, ToolbarModule } from 'primeng/primeng';

import { EmployeeListComponent } from './employee-list';
import { EmployeeDetailComponent } from './employee-detail';
import { EmployeeRoutingModule } from './employees-routing.module';
import { EmployeeService } from './employee.service';
import { SchemesModule } from "../schemes/schemes.module";

@NgModule({
    declarations: [EmployeeDetailComponent, EmployeeListComponent],
    exports: [DataTableModule, ButtonModule,  FieldsetModule, InputTextModule, InputTextareaModule, SpinnerModule],
    imports: [CommonModule,
        DataTableModule,
        EmployeeRoutingModule,
        AutoCompleteModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        FieldsetModule,
        FormsModule,
        EmployeeRoutingModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        SchemesModule,
        SpinnerModule,
        TabViewModule,
        ToolbarModule],
    providers: [EmployeeService]
})

export class EmployeesModule { }
