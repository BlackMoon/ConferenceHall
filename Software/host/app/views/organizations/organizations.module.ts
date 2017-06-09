import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationRoutingModule } from './organizations-routing.module';

import {
    ButtonModule,
    DataTableModule,
    InputTextModule,
    TreeTableModule,
    ToolbarModule
} from 'primeng/primeng';

import { OrganizationTreeComponent } from "./organization-tree.component";
import { OrganizationService } from "./organization.service";

@NgModule({
    declarations: [OrganizationTreeComponent],
    exports: [DataTableModule, InputTextModule, OrganizationTreeComponent],
    imports: [
        ButtonModule,
        CommonModule,
        DataTableModule,
        FormsModule,
        InputTextModule,
        OrganizationRoutingModule,
        ReactiveFormsModule,
        TreeTableModule,
        ToolbarModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }