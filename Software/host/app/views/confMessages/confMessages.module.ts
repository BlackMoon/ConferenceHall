import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    DragDropModule,
    DropdownModule,
    FieldsetModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    PanelModule,
    SpinnerModule,
    TabViewModule,
    ToggleButtonModule,
    ToolbarModule
} from 'primeng/primeng';

import { ElementsModule } from "../elements/elements.module";
import { GroupsModule } from "../groups/groups.module";
import { ConfMessageListComponent } from "./confMessage-list.component";
import { ConfMessageService } from './confMessage.service';

@NgModule({
    declarations: [ConfMessageListComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, ConfMessageListComponent, SpinnerModule],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        DragDropModule,
        DropdownModule,
        ElementsModule,
        FieldsetModule,
        FormsModule,
        GroupsModule,
        InputTextModule,
        InputTextareaModule,
        MenuModule,
        PanelModule,
        ReactiveFormsModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule],
    providers: [ConfMessageService]
})
export class ConfMessagesModule { }
