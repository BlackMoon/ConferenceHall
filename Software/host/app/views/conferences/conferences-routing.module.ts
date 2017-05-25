import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConferenceDetailComponent } from './conference-detail.component';
import { ConferenceScheduleComponent } from './conference-schedule.component';

const conferenceRoutes: Routes = [
    { path: 'schedule', component: ConferenceScheduleComponent },
    { path: 'conferences/new', component: ConferenceDetailComponent },
    { path: 'conferences/:id', component: ConferenceDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(conferenceRoutes)],
    exports: [RouterModule]
})
export class ConferenceRoutingModule { }