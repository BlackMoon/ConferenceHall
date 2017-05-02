﻿import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ElementDetailComponent } from '../elements/element-detail.component';
import { ElementListComponent } from '../elements/element-list.component';
import { GroupListComponent } from '../groups/group-list.component';
import { SchemeDetailComponent } from './scheme-detail.component';

const schemeRoutes: Routes = [
    {
        path: "schemes/:id", component: SchemeDetailComponent,
        children: [
            { path: "", redirectTo: "groups", pathMatch: "full" },
            { path: "groups", component: GroupListComponent, data: { preload: true } },
            { path: "elements", component: ElementListComponent },
            { path: "elements/new", component: ElementDetailComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(schemeRoutes)],
    exports: [RouterModule]
})
export class SchemeRoutingModule { }