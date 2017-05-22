import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AccordionModule, ButtonModule, DataListModule, DragDropModule, ScheduleModule, TabViewModule } from 'primeng/primeng';
import { ConferenceRoutingModule } from './conferences-routing.module';
import { ConferenceListComponent } from './conference-list.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';
import { ConferenceService } from './conference.service';

@NgModule({
    declarations: [ConferenceListComponent, ConferenceScheduleComponent],
    exports: [ScheduleModule],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        ConferenceRoutingModule,
        DataListModule,
        DragDropModule,
        ScheduleModule,
        TabViewModule],
    providers: [ConferenceService]
})
export class ConferencesModule { }