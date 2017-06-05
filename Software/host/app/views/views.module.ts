import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, GrowlModule, SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import { ConferencesModule } from './conferences/conferences.module';
import { ElementsModule } from './elements/elements.module';
import { HallsModule } from './halls/halls.module';
import { MembersModule } from './members/members.module';
import { SchemesModule } from './schemes/schemes.module';
import { ScreenModule } from './screen/screen.module';
import { HomeView } from './home.view';

@NgModule({
    declarations: [HomeView],
    exports: [ConfirmDialogModule, CommonModule, GrowlModule],
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ConferencesModule,
        SchemesModule,
        ElementsModule,
        GrowlModule,
        HallsModule,
        MembersModule,
        RouterModule,
        SchemesModule,
        ScreenModule,
        SplitButtonModule,
        ToolbarModule],
    providers: [ConfirmationService]
})
export class ViewsModule { }