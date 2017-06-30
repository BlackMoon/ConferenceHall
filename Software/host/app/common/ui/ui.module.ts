import { NgModule } from '@angular/core';
import { DetailComponent } from "./detail.component";
import { MatchTableDirective } from "./match-table.directive";

@NgModule({
    declarations: [DetailComponent, MatchTableDirective],
    exports: [DetailComponent, MatchTableDirective]
})
export class UiModule { }
