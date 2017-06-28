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
    InputSwitchModule,
    MenuModule,
    ScheduleModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule,
    ToolbarModule
} from 'primeng/primeng';

import { HubService } from "../../common/hub-service";
import { AppointmentDialogComponent } from './appointment-dialog.component';
import { DateToUtcPipe } from "../../common/globals/pipes";

import { ConferenceMainComponent } from './conference-main.component';
import { ConferenceTableComponent } from './conference-table.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';
import { ConferenceRoutingModule } from './conferences-routing.module';
import { ConferenceService } from './conference.service';

import { UiModule } from '../../common/ui/ui.module';
import { HallsModule } from '../halls/halls.module';
import { MembersModule } from '../members/members.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { SchemesModule } from '../schemes/schemes.module';
import { TickersModule } from '../tickers/tickers.module';

@NgModule({
    declarations: [AppointmentDialogComponent, ConferenceMainComponent, ConferenceTableComponent, ConferenceScheduleComponent],
    imports: [
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
        InputSwitchModule,
        MembersModule,
        MenuModule,
        OrganizationsModule,
        ReactiveFormsModule,
        ScheduleModule,
        SplitButtonModule,
        TabViewModule,
        TickersModule,
        ToggleButtonModule,
        ToolbarModule,
        UiModule],
    providers: [ConferenceService, DatePipe, DateToUtcPipe, HubService]
})
export class ConferencesModule { }