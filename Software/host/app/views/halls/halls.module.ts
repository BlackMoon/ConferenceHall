import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataGridModule, PanelModule } from 'primeng/primeng';

import { HallListComponent } from './hall-list';
import { HallDetailComponent } from './hall-detail';
import { HallRoutingModule } from './halls-routing.module';
import { HallService } from './hall.service';

@NgModule({
    declarations: [HallDetailComponent, HallListComponent],
    exports: [DataGridModule],
    imports: [CommonModule, DataGridModule, FormsModule, HallRoutingModule, PanelModule ],
    providers: [HallService]
})
export class HallsModule { }
