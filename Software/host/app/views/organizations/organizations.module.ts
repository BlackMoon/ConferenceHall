import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalsModule } from '../../common/globals/globals.module';
import { UiModule } from '../../common/ui/ui.module';
import { EmployeesModule } from '../employees/employees.module';
import { OrganizationRoutingModule } from './organizations-routing.module';

import {
    AccordionModule,
    BlockUIModule,
    ButtonModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
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
        BlockUIModule,
        ButtonModule, 
        CommonModule,
        GlobalsModule,
        EmployeesModule,
        FileUploadModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        OrganizationRoutingModule,
        PanelModule,
        ReactiveFormsModule,
        SelectButtonModule,
        SplitButtonModule,
        ToggleButtonModule,
        ToolbarModule,
        TreeTableModule,
        UiModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }