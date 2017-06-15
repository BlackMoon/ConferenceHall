import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    CalendarModule,
    DataListModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    MenuModule,
    ScheduleModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule,
    ToolbarModule,
    PanelModule
} from 'primeng/primeng';

import { HubService } from "../../common/hub-service";

import { AppointmentDialogComponent } from './appointment-dialog.component';
import { DateToUtcPipe } from "../../common/globals/pipes";
import { ConferenceRoutingModule } from './conferences-routing.module';
import { ConferenceDetailComponent } from './conference-detail.component';
import { ConferenceTableComponent } from './conference-table.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';
import { ConferenceService } from './conference.service';

import { HallsModule } from '../halls/halls.module';
import { MembersModule } from '../members/members.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { SchemesModule } from '../schemes/schemes.module';
//import { EmployeesModule } from '../employees/employees.module';


@NgModule({
    declarations: [AppointmentDialogComponent, ConferenceDetailComponent, ConferenceTableComponent, ConferenceScheduleComponent],
    imports: [
        
  //      EmployeesModule,
        SchemesModule,
        AccordionModule,
        ButtonModule,
        CalendarModule,
        CommonModule,
        ConferenceRoutingModule,
        DataListModule,
        DataTableModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        FormsModule,
        HallsModule,
        MembersModule,
        MenuModule,
        OrganizationsModule,
        ReactiveFormsModule,
        ScheduleModule,
        SplitButtonModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule,
        PanelModule],
    providers: [ConferenceService, DatePipe, DateToUtcPipe, HubService]
})
export class ConferencesModule { }