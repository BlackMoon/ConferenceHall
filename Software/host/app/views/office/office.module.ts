import { NgModule } from '@angular/core';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeComponent } from './office.component';

@NgModule({
    declarations: [OfficeComponent],
    imports: [OfficeRoutingModule]
})
export class OfficeModule { }