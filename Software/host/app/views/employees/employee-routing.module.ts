import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeTableComponent } from './employee-table.component';

const employeeRoutes: Routes = [
    { path: 'employees', component: EmployeeTableComponent },
    { path: 'employees/:id', component: EmployeeDetailComponent },
    { path: 'employees/new', component: EmployeeDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(employeeRoutes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }