import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, DataTableModule, DropdownModule, InputSwitchModule, InputTextModule, ToggleButtonModule } from 'primeng/primeng';

import { ContactTableComponent } from "./contact-table.component";
import { ContactService } from "./contact.service";

@NgModule({
    declarations: [ContactTableComponent],
    exports: [ ContactTableComponent],
    imports: [CommonModule, ButtonModule, DataTableModule, DropdownModule, FormsModule, InputSwitchModule, InputTextModule, ReactiveFormsModule, ToggleButtonModule ],
    providers: [ContactService]
})
export class ContactsModule { }