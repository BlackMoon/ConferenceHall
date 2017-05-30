import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreenComponent } from './screen.component';

const conferenceRoutes: Routes = [
    { path: 'screen/:id', component: ScreenComponent }
];

@NgModule({
    imports: [RouterModule.forChild(conferenceRoutes)],
    exports: [RouterModule]
})
export class ScreenRoutingModule { }