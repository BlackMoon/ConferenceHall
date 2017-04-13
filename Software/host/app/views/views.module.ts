import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule, ButtonModule } from 'primeng/primeng';
import * as views from './index';

@NgModule({
    declarations: [views.EditorView, views.HomeView, views.MeetingsView, views.MembersView],
    imports: [RouterModule]
})
export class ViewsModule { }