import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtonModule, DataGridModule, PanelModule } from 'primeng/primeng';

import { HallListComponent } from './hall-list.component';
import { HallDetailComponent } from './hall-detail.component';
import { HallRoutingModule } from './halls-routing.module';
import { HallService } from './hall.service';

@NgModule({
    declarations: [HallDetailComponent, HallListComponent],
    exports: [ButtonModule, DataGridModule],
    imports: [ButtonModule, CommonModule, DataGridModule, FormsModule, HallRoutingModule, PanelModule ],
    providers: [HallService]
})
export class HallsModule { }
