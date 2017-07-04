import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from '../../common/navigation/layout';

import { ScreenComponent } from './screen.component';
import { ScreenTableComponent } from './screen-table.component';

const screenRoutes: Routes = [
    { path: 'screens', component: ScreenTableComponent, data: { layout: Layout.ShowHeader | Layout.ShowFooter } },
    { path: 'screens/:id', component: ScreenComponent,  data: { layout: Layout.None } }
];

@NgModule({
    imports: [RouterModule.forChild(screenRoutes)],
    exports: [RouterModule]
})
export class ScreenRoutingModule { }