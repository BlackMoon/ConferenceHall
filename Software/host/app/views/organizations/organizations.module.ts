import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    ButtonModule,
    DataTableModule,
    InputTextModule,
    ToolbarModule
} from 'primeng/primeng';

import { OrganizationListComponent } from "./organization-list.component";
import { OrganizationService } from "./organization.service";

@NgModule({
    declarations: [OrganizationListComponent],
    exports: [DataTableModule, InputTextModule, OrganizationListComponent],
    imports: [
        ButtonModule,
        CommonModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        ToolbarModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }