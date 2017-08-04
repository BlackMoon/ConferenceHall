import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OfficeComponent } from './office.component';

const officeRoutes: Routes = [
    { path: 'office', component: OfficeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(officeRoutes)],
    exports: [RouterModule]
})
export class OfficeRoutingModule { }