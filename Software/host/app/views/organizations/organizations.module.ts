import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationRoutingModule } from './organizations-routing.module';

import {
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    ToggleButtonModule,
    ToolbarModule,
    TreeTableModule
} from 'primeng/primeng';

import { OrganizationTreeComponent } from "./organization-tree.component";
import { OrganizationService } from "./organization.service";

@NgModule({
    declarations: [OrganizationTreeComponent],
    exports: [OrganizationTreeComponent],
    imports: [
        ButtonModule, 
        CommonModule,
        FormsModule,
        InputTextModule,
        OrganizationRoutingModule,
        ReactiveFormsModule,
        SelectButtonModule,
        ToggleButtonModule,
        ToolbarModule,
        TreeTableModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }