import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrganizationTreeComponent } from "./organization-tree.component";

const orgRoutes: Routes = [
    { path: 'orgs', component: OrganizationTreeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(orgRoutes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule { }