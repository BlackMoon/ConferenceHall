import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import { HallsModule } from './halls/halls.module';
import * as views from './index';

@NgModule({
    declarations: [Object.values(views)],
    exports: [ConfirmDialogModule, ToolbarModule],
    imports: [CommonModule, ConfirmDialogModule, HallsModule, RouterModule, SplitButtonModule, ToolbarModule],
    providers: [ConfirmationService]
})
export class ViewsModule { }