import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { ViewsModule } from '../../views/views.module';
import * as views from '../../views';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },    
    { path: 'home', component: views.HomeView }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: SelectivePreloadingStrategy }), ViewsModule],
    exports: [RouterModule, ViewsModule],
    providers: [ SelectivePreloadingStrategy ]
})
export class NavigationModule { }
