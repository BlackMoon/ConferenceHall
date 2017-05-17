import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AccordionModule, ScheduleModule } from 'primeng/primeng';
import { ConferenceRoutingModule } from './conferences-routing.module';
import { ConferenceScheduleComponent } from './conference-schedule.component';
import { ConferenceService } from './conference.service';

@NgModule({
    declarations: [ConferenceScheduleComponent],
    exports: [ScheduleModule],
    imports: [
        AccordionModule,
        ConferenceRoutingModule,
        ScheduleModule],
    providers: [ConferenceService]
})
export class ConferencesModule { }