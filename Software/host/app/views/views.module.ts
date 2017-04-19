import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SplitPaneModule } from 'ng2-split-pane';
import { AutoCompleteModule, ConfirmDialogModule, ConfirmationService, SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import { HallsModule } from './halls/halls.module';
import * as views from './index';

@NgModule({
    declarations: [Object.values(views)],
    exports: [AutoCompleteModule, ConfirmDialogModule, SplitPaneModule, ToolbarModule],
    imports: [AutoCompleteModule, CommonModule, ConfirmDialogModule, HallsModule, RouterModule, SplitButtonModule, SplitPaneModule, ToolbarModule],
    providers: [ConfirmationService]
})
export class ViewsModule { }