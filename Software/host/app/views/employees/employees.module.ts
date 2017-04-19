import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataGridModule, PanelModule } from 'primeng/primeng';

import { EmployeeListComponent } from './employee-list';
import { EmployeeDetailComponent } from './employee-detail';
import { EmployeeRoutingModule } from './employees-routing.module';
import { EmployeeService } from './employee.service';

@NgModule({
    declarations: [EmployeeDetailComponent, EmployeeListComponent],
    exports: [DataGridModule],
    imports: [CommonModule, DataGridModule, FormsModule, EmployeeRoutingModule, PanelModule],
    providers: [EmployeeService]
})
export class EmployeesModule { }
