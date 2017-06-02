import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HallDetailComponent } from './hall-detail.component';
import { HallGridComponent } from './hall-grid.component';

const hallRoutes: Routes = [
    { path: 'halls', component: HallGridComponent },
    { path: 'halls/new', component: HallDetailComponent },    
    { path: 'halls/:id', component: HallDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(hallRoutes)],
    exports: [RouterModule]
})
export class HallRoutingModule { }