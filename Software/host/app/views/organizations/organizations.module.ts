import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesModule } from '../employees/employees.module';
import { OrganizationRoutingModule } from './organizations-routing.module';


import {
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    SelectButtonModule,
    SplitButtonModule,
    TabMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TreeTableModule
} from 'primeng/primeng';

import { OrganizationDetailComponent } from "./organization-detail.component";
import { OrganizationTreeComponent } from "./organization-tree.component";
import { OrganizationService } from "./organization.service";

@NgModule({
    declarations: [OrganizationDetailComponent, OrganizationTreeComponent],
    exports: [OrganizationTreeComponent],
    imports: [
        ButtonModule, 
        CommonModule,
        EmployeesModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        OrganizationRoutingModule,
        ReactiveFormsModule,
        SelectButtonModule,
        SplitButtonModule,
        TabMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TreeTableModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }