import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { LoginComponent } from '../auth/login.component';
import { ViewsModule } from '../../views/views.module';

const routes: Routes = [
    { path: '', redirectTo: '/screens', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { layout: Layout.ShowHeader | Layout.ShowFooter | Layout.ShowLeftSide | Layout.ShowRightSide } }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: SelectivePreloadingStrategy }), ViewsModule],
    exports: [RouterModule, ViewsModule],
    providers: [ SelectivePreloadingStrategy ]
})
export class NavigationModule { }
