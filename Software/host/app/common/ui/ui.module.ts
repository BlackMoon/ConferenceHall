import { NgModule } from "@angular/core";
import { SplitButtonModule } from 'primeng/primeng';

import { CoqsComponent } from "./cogs.component";

@NgModule({
    declarations: [CoqsComponent],
    exports: [CoqsComponent],
    imports: [SplitButtonModule]
})
export class UiModule { }