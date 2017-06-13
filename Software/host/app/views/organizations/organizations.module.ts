import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalsModule } from '../../common/globals/globals.module';
import { EmployeesModule } from '../employees/employees.module';
import { OrganizationRoutingModule } from './organizations-routing.module';

import {
    AccordionModule,
    ButtonModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    SelectButtonModule,
    SplitButtonModule,
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
        AccordionModule,
        ButtonModule, 
        CommonModule,
        GlobalsModule,
        EmployeesModule,
        FileUploadModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        OrganizationRoutingModule,
        ReactiveFormsModule,
        SelectButtonModule,
        SplitButtonModule,
        ToggleButtonModule,
        ToolbarModule,
        TreeTableModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }