import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, DataTableModule, InputSwitchModule, InputTextareaModule, ToggleButtonModule } from 'primeng/primeng';

import { MessageTableComponent } from "./message-table.component";
import { MessageService } from "./message.service";

@NgModule({
    declarations: [MessageTableComponent],
    exports: [MessageTableComponent],
    imports: [ CommonModule, ButtonModule, DataTableModule, FormsModule, InputSwitchModule, InputTextareaModule, ReactiveFormsModule, ToggleButtonModule ],
    providers: [MessageService]
})
export class MessagesModule { }