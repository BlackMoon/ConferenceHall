import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from "../../common/navigation/layout";
import { HallDetailComponent } from './hall-detail.component';
import { HallTableComponent } from './hall-table.component';

const hallRoutes: Routes = [
    { path: 'halls', component: HallTableComponent },
    { path: 'halls/new', component: HallDetailComponent },    
    { path: 'halls/:id', component: HallDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(hallRoutes)],
    exports: [RouterModule]
})
export class HallRoutingModule { }