import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, GrowlModule, SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import { ConferencesModule } from './conferences/conferences.module';
import { ElementsModule } from './elements/elements.module';
import { HallsModule } from './halls/halls.module';
import { SchemesModule } from './schemes/schemes.module';
import { ScreenModule } from './screen/screen.module';
import * as views from './index';

@NgModule({
    declarations: [Object.values(views)],
    exports: [ConfirmDialogModule, GrowlModule],
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ConferencesModule,
        SchemesModule,
        ElementsModule,
        GrowlModule,
        HallsModule,
        RouterModule,
        SchemesModule,
        ScreenModule,
        SplitButtonModule,
        ToolbarModule],
    providers: [ConfirmationService]
})
export class ViewsModule { }