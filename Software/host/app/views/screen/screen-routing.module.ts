import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from '../../common/navigation/layout';

import { ScreenComponent } from './screen.component';

const screenRoutes: Routes = [
    { path: 'screens/:id', component: ScreenComponent,  data: { layout: Layout.None } }
];

@NgModule({
    imports: [RouterModule.forChild(screenRoutes)],
    exports: [RouterModule]
})
export class ScreenRoutingModule { }