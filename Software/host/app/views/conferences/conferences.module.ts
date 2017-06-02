import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AccordionModule, ButtonModule, CalendarModule, DataListModule, DialogModule, DragDropModule, DropdownModule, MenuModule, ScheduleModule, SplitButtonModule, TabViewModule, ToolbarModule } from 'primeng/primeng';
import { AppointmentDialogComponent } from './appointment-dialog.component';
import { ConferenceRoutingModule } from './conferences-routing.module';
import { ConferenceDetailComponent } from './conference-detail.component';
import { ConferenceListComponent } from './conference-list.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';
import { ConferenceService } from './conference.service';
import { DateToUtcPipe } from "../../common/pipes";

@NgModule({
    declarations: [AppointmentDialogComponent, ConferenceDetailComponent, ConferenceListComponent, ConferenceScheduleComponent],
    imports: [
        AccordionModule,
        ButtonModule,
        CalendarModule,
        CommonModule,
        ConferenceRoutingModule,
        DataListModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        FormsModule,
        MenuModule,
        ReactiveFormsModule,
        ScheduleModule,
        SplitButtonModule,
        TabViewModule,
        ToolbarModule],
    providers: [ConferenceService, DateToUtcPipe]
})
export class ConferencesModule { }