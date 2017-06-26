import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule, ButtonModule, DataTableModule, InputSwitchModule, InputTextareaModule, MessagesModule, MultiSelectModule, PanelModule, ToggleButtonModule } from 'primeng/primeng';

import { TickerTableComponent } from "./ticker-table.component";
import { NotificationComponent } from "./notification.component";
import { TickerRoutingModule } from './tickers-routing.module';
import { TickerService } from "./ticker.service";

@NgModule({
    declarations: [NotificationComponent, TickerTableComponent],
    exports: [TickerTableComponent],
    imports: [BlockUIModule, ButtonModule, CommonModule, DataTableModule, FormsModule, InputSwitchModule, InputTextareaModule, MessagesModule, MultiSelectModule, PanelModule, ReactiveFormsModule, TickerRoutingModule, ToggleButtonModule ],
    providers: [TickerService]
})
export class TickersModule { }