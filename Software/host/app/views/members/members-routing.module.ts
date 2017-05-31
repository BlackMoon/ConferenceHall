import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberListComponent } from './member-list.component';
import { MemberDetailComponent } from './member-detail.component';

const memberRoutes: Routes = [
    { path: 'members', component: MemberListComponent },
    { path: 'member/:id', component: MemberDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(memberRoutes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }