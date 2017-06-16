import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    CheckboxModule,
    DataTableModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    PasswordModule,
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
        CheckboxModule,
        CommonModule,
        DataTableModule,
        DropdownModule,   
        FormsModule,      
        InputSwitchModule,
        InputTextModule,
        EmployeeRoutingModule,
        PasswordModule,
        ReactiveFormsModule,
        ToggleButtonModule
    ],
    providers: [EmployeeService]
})
export class EmployeesModule { }
