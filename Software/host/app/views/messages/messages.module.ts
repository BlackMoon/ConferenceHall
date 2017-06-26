import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, DataTableModule, InputSwitchModule, InputTextareaModule, MultiSelectModule, ToggleButtonModule } from 'primeng/primeng';

import { MessageTableComponent } from "./message-table.component";
import { SendMessageComponent } from "./send-message.component";
import { MessageRoutingModule } from './messages-routing.module';
import { MessageService } from "./message.service";

@NgModule({
    declarations: [MessageTableComponent, SendMessageComponent],
    exports: [MessageTableComponent],
    imports: [CommonModule, ButtonModule, DataTableModule, FormsModule, InputSwitchModule, InputTextareaModule, MessageRoutingModule, MultiSelectModule, ReactiveFormsModule, ToggleButtonModule ],
    providers: [MessageService]
})
export class MessagesModule { }