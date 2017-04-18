import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HallListComponent } from './hall-list';
import { HallDetailComponent } from './hall-detail';

const hallRoutes: Routes = [
    { path: 'halls', component: HallListComponent },
    { path: 'hall/:id', component: HallDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(hallRoutes)],
    exports: [RouterModule]
})
export class HallRoutingModule { }