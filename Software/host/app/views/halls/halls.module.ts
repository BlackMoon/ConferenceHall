﻿import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataListModule } from 'primeng/primeng';

import { HallListComponent } from './hall-list';
import { HallDetailComponent } from './hall-detail';
import { HallRoutingModule } from './halls-routing.module';
import { HallService } from './hall.service';

@NgModule({
    declarations: [HallDetailComponent, HallListComponent],
    exports: [DataListModule],
    imports: [CommonModule, DataListModule, FormsModule, HallRoutingModule ],
    providers: [HallService]
})
export class HallsModule { }
