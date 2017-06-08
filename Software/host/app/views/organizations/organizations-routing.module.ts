import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const orgRoutes: Routes = [
    //{ path: 'org/:id', component: ScreenComponent }
];

@NgModule({
    imports: [RouterModule.forChild(orgRoutes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule { }