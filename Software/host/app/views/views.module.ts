import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import {
    ConfirmDialogModule,
    ConfirmationService,
    GrowlModule
} from 'primeng/primeng';

import { ConferencesModule } from './conferences/conferences.module';
import { ElementsModule } from './elements/elements.module';
import { EmployeesModule } from './employees/employees.module';
import { HallsModule } from './halls/halls.module';
import { MembersModule } from './members/members.module';
import { OfficeModule } from './office/office.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SchemesModule } from './schemes/schemes.module';
import { ScreenModule } from './screen/screen.module';

@NgModule({
    exports: [ConfirmDialogModule, CommonModule, GrowlModule],
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ConferencesModule,
        SchemesModule,
        ElementsModule,
        EmployeesModule,
        GrowlModule,
        HallsModule,
        MembersModule,
        OfficeModule,
        OrganizationsModule,
        RouterModule,
        SchemesModule,
        ScreenModule],
    providers: [ConfirmationService]
})
export class ViewsModule { }