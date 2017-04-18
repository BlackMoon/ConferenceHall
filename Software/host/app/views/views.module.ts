import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SplitPaneModule } from 'ng2-split-pane';
import { AutoCompleteModule, SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import { HallsModule } from './halls/halls.module';
import * as views from './index';

@NgModule({
    declarations: [Object.values(views)],
    exports: [AutoCompleteModule, SplitPaneModule, ToolbarModule],
    imports: [AutoCompleteModule, CommonModule, HallsModule, RouterModule, SplitButtonModule, SplitPaneModule, ToolbarModule]
})
export class ViewsModule { }