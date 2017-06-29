import { NgModule } from '@angular/core';
import { DetailComponent } from "./detail.component";
import { MatchTreeDirective } from "./match-tree.directive";

@NgModule({
    declarations: [DetailComponent, MatchTreeDirective],
    exports: [DetailComponent, MatchTreeDirective]
})
export class UiModule { }
