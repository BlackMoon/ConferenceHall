import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupListComponent } from '../groups/group-list.component';
import { SchemeDetailComponent } from './scheme-detail.component';

const schemeRoutes: Routes = [
    {
        path: "scheme/:id", component: SchemeDetailComponent,
        children: [
            { path: "", redirectTo: "groups", pathMatch: "full" },
            { path: "groups", component: GroupListComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(schemeRoutes)],
    exports: [RouterModule]
})
export class SchemeRoutingModule { }