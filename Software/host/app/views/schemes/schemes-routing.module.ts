import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchemeDetailComponent } from './scheme-detail.component';

const schemeRoutes: Routes = [
    { path: 'scheme/:id', component: SchemeDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(schemeRoutes)],
    exports: [RouterModule]
})
export class SchemeRoutingModule { }