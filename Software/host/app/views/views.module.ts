import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import * as views from '.';

@NgModule({
    entryComponents: [views.HomeView],
    declarations: [views.EditorView, views.HomeView, views.MembersView],
    exports: [views.EditorView, views.HomeView, views.MembersView],
    imports: [RouterModule]
})
export class ViewsModule { }