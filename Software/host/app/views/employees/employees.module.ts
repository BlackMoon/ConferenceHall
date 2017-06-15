import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    DataTableModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    ToggleButtonModule
} from 'primeng/primeng';

import { ContactTableComponent } from './contact-table.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeService } from './employee.service';

@NgModule({
    declarations: [ContactTableComponent, EmployeeDetailComponent],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataTableModule,
        DropdownModule,   
        FormsModule,      
        InputSwitchModule,
        InputTextModule,
        EmployeeRoutingModule,
        ReactiveFormsModule,
        ToggleButtonModule
    ],
    providers: [EmployeeService]
})
export class EmployeesModule { }
