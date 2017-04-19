import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeListComponent } from './employee-list';
import { EmployeeDetailComponent } from './employee-detail';

const employeeRoutes: Routes = [
    { path: 'employees', component: EmployeeListComponent },
    { path: 'employee/:id', component: EmployeeDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(employeeRoutes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }