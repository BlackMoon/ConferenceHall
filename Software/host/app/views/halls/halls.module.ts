import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, PanelModule, SpinnerModule, ToolbarModule } from 'primeng/primeng';

import { HallListComponent } from './hall-list.component';
import { HallDetailComponent } from './hall-detail.component';
import { HallRoutingModule } from './halls-routing.module';
import { HallService } from './hall.service';

@NgModule({
    declarations: [HallDetailComponent, HallListComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, SpinnerModule],
    imports: [ButtonModule, CommonModule, DataGridModule, FieldsetModule, FormsModule, HallRoutingModule, InputTextModule, InputTextareaModule, PanelModule, ReactiveFormsModule, SpinnerModule, ToolbarModule ],
    providers: [HallService]
})
export class HallsModule { }
