import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConferenceScheduleComponent } from './conference-schedule.component';

const conferenceRoutes: Routes = [
    { path: 'schedule', component: ConferenceScheduleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(conferenceRoutes)],
    exports: [RouterModule]
})
export class ConferenceRoutingModule { }