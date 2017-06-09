import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrgMemberTableComponent } from './org-member-table.component';
//import { MemberDetailComponent } from './member-detail.component';

const memberRoutes: Routes = [
    { path: 'members', component: OrgMemberTableComponent },
    //{ path: 'members/:id', component: MemberDetailComponent },
    //{ path: 'members/new', component: MemberDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(memberRoutes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }