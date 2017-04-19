import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewsModule } from '../../views/views.module';
import * as views from '../../views';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },    
    { path: 'editor', component: views.EditorView },
    { path: 'home', component: views.HomeView },
    { path: 'meetings', component: views.MeetingsView },
    { path: 'members', component: views.MembersView }
];

@NgModule({
    imports: [RouterModule.forRoot(routes), ViewsModule],
    exports: [RouterModule, ViewsModule]
})
export class NavigationModule { }
