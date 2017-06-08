import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeTableComponent } from './employee-table.component';
import { MemberDetailComponent } from './member-detail.component';

const employeeRoutes: Routes = [
    { path: 'employees', component: EmployeeTableComponent },
    { path: 'employees/:id', component: MemberDetailComponent },
    { path: 'employees/new', component: MemberDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(employeeRoutes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }