import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HallDetailComponent } from './hall-detail.component';
import { HallListComponent } from './hall-list.component';
import { SchemeEditorComponent } from './scheme-editor.component';

const hallRoutes: Routes = [
    { path: 'halls', component: HallListComponent },
    { path: 'hall', component: HallDetailComponent },    
    { path: 'hall/:id', component: HallDetailComponent },
    { path: 'scheme/:id', component: SchemeEditorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(hallRoutes)],
    exports: [RouterModule]
})
export class HallRoutingModule { }