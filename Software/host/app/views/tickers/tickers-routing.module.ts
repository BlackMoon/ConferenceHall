import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationComponent } from './notification.component';

const tickerRoutes: Routes = [
    { path: 'send', component: NotificationComponent },
    { path: 'send/:confid', component: NotificationComponent }
];

@NgModule({
    imports: [RouterModule.forChild(tickerRoutes)],
    exports: [RouterModule]
})
export class TickerRoutingModule { }