import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AccordionModule, ButtonModule, DataGridModule, DataListModule, FieldsetModule, InputTextModule, InputTextareaModule, PanelModule, SpinnerModule, TabViewModule, ToolbarModule } from 'primeng/primeng';
import { HallDetailComponent } from './hall-detail.component';
import { HallGridComponent } from './hall-grid.component';
import { HallListComponent } from './hall-list.component';
import { HallTableComponent } from './hall-table.component';
import { HallRoutingModule } from './halls-routing.module';
import { HallService } from './hall.service';
import { SchemesModule } from "../schemes/schemes.module";

@NgModule({
    declarations: [HallDetailComponent, HallGridComponent, HallListComponent, HallTableComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, SpinnerModule, HallListComponent, HallTableComponent],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        FieldsetModule,
        FormsModule,
        HallRoutingModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        ReactiveFormsModule,
        SchemesModule, 
        SpinnerModule,
        TabViewModule,
        ToolbarModule],
    providers: [HallService]
})
export class HallsModule { }
