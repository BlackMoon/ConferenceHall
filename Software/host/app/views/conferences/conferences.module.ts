import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AccordionModule, ButtonModule, DataListModule, DragDropModule, DropdownModule, ScheduleModule, SplitButtonModule, TabViewModule, ToolbarModule } from 'primeng/primeng';
import { AppointmentDialogComponent } from './appointment-dialog.component';
import { ConferenceRoutingModule } from './conferences-routing.module';
import { ConferenceListComponent } from './conference-list.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';
import { ConferenceService } from './conference.service';

@NgModule({
    declarations: [AppointmentDialogComponent, ConferenceListComponent, ConferenceScheduleComponent],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        ConferenceRoutingModule,
        DataListModule,
        DragDropModule,
        DropdownModule,
        FormsModule,
        ScheduleModule,
        SplitButtonModule,
        TabViewModule,
        ToolbarModule],
    providers: [ConferenceService]
})
export class ConferencesModule { }