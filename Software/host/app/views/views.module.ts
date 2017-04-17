import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
//import { AngularSplitModule } from 'angular-split';
import { SplitButtonModule, ToolbarModule } from 'primeng/primeng';
import * as views from './index';

@NgModule({
    declarations: [Object.values(views)],
    exports: [ToolbarModule],
    imports: [ RouterModule, SplitButtonModule, ToolbarModule]
})
export class ViewsModule { }