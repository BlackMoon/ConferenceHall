import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../common/auth/auth.guard";
import { Layout } from '../../common/navigation/layout';

import { ScreenComponent } from './screen.component';
import { ScreenTableComponent } from './screen-table.component';

const screenRoutes: Routes = [
    // presentation mode
    { path: 'screen/:id', component: ScreenComponent, data: { layout: Layout.None } },
    { path: 'screens', component: ScreenTableComponent, canActivate: [AuthGuard], data: { layout: Layout.ShowHeader | Layout.ShowFooter | Layout.ShowLeftSide | Layout.ShowRightSide } },
    { path: 'screens/:startDate', component: ScreenTableComponent, data: { layout: Layout.ShowHeader | Layout.ShowFooter | Layout.ShowLeftSide | Layout.ShowRightSide } }
];

@NgModule({
    imports: [RouterModule.forChild(screenRoutes)],
    exports: [RouterModule]
})
export class ScreenRoutingModule { }