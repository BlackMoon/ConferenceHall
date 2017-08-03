import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrganizationDetailComponent } from "./organization-detail.component";
import { OrganizationTreeComponent } from "./organization-tree.component";

const orgRoutes: Routes = [
    { path: 'orgs', component: OrganizationTreeComponent },
    { path: 'orgs/new', component: OrganizationDetailComponent },
    { path: 'orgs/:id', component: OrganizationDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(orgRoutes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule { }