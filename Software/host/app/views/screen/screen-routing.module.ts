import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreenComponent } from './screen.component';

const screenRoutes: Routes = [
    { path: 'screen/:id', component: ScreenComponent }
];

@NgModule({
    imports: [RouterModule.forChild(screenRoutes)],
    exports: [RouterModule]
})
export class ScreenRoutingModule { }