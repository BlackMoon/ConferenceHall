import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConferenceMainComponent } from './conference-main.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';

const conferenceRoutes: Routes = [
    { path: 'schedule', component: ConferenceScheduleComponent },
    { path: 'conferences/new', component: ConferenceMainComponent },
    { path: 'conferences/:id', component: ConferenceMainComponent }
];

@NgModule({
    imports: [RouterModule.forChild(conferenceRoutes)],
    exports: [RouterModule]
})
export class ConferenceRoutingModule { }