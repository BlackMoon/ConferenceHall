import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SplitButtonModule } from 'primeng/primeng';
import * as views from './index';

@NgModule({
    declarations: [views.EditorView, views.HomeView, views.MeetingsView, views.MembersView],
    exports: [SplitButtonModule],
    imports: [RouterModule, SplitButtonModule]
})
export class ViewsModule { }