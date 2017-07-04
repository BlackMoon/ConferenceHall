import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { ViewsModule } from '../../views/views.module';

const routes: Routes = [
    { path: '', redirectTo: '/screens', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: SelectivePreloadingStrategy }), ViewsModule],
    exports: [RouterModule, ViewsModule],
    providers: [ SelectivePreloadingStrategy ]
})
export class NavigationModule { }
