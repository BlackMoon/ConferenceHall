import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HallDetailComponent } from './hall-detail.component';
import { HallListComponent } from './hall-list.component';

const hallRoutes: Routes = [
    { path: 'halls', component: HallListComponent },
    { path: 'halls/new', component: HallDetailComponent },    
    { path: 'halls/:id', component: HallDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(hallRoutes)],
    exports: [RouterModule]
})
export class HallRoutingModule { }