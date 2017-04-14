import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
//import { AngularSplitModule } from 'angular-split';
import { SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import * as views from './index';

@NgModule({
    declarations: [views.EditorView, views.HomeView, views.MeetingsView, views.MembersView],
    exports: [ToolbarModule],
    imports: [RouterModule, SplitButtonModule, ToolbarModule]
})
export class ViewsModule { }