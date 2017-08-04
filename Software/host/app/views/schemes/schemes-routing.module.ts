import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from '../../common/navigation/selective-preloading-strategy';
import { Layout } from "../../common/navigation/layout";
import { ElementDetailComponent } from '../elements/element-detail.component';
import { ElementListComponent } from '../elements/element-list.component';
import { GroupTableComponent } from '../groups/group-table.component';
import { SchemeDetailComponent } from './scheme-detail.component';
import { ShapePropertiesComponent } from './shape-properties.component';

const schemeRoutes: Routes = [
    {
        path: "schemes/:id", component: SchemeDetailComponent,
        children: [
            { path: "", redirectTo: "groups", pathMatch: "full" },
            { path: "groups", component: GroupTableComponent, data: { layout: Layout.None } },
            { path: "elements", component: ElementListComponent, data: { layout: Layout.None } },
            { path: "elements/new", component: ElementDetailComponent, data: { layout: Layout.None } },
            { path: "elements/:id", component: ElementDetailComponent, data: { layout: Layout.None } },
            { path: "shape", component: ShapePropertiesComponent, data: { layout: Layout.None } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(schemeRoutes)],
    exports: [RouterModule]
})
export class SchemeRoutingModule { }