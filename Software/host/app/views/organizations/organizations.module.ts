import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
    DataTableModule,
    InputTextModule,
    ToolbarModule
} from 'primeng/primeng';

import { OrganizationListComponent } from "./organization-list.component";
import { OrganizationService } from "./organization.service";

@NgModule({
    declarations: [OrganizationListComponent],
    imports: [CommonModule],
    exports: [
        DataTableModule,
        InputTextModule,
        OrganizationListComponent,
        ToolbarModule
    ],
    providers: [OrganizationService]
})
export class OrganizationsModule { }