import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AutoCompleteModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
    SpinnerModule,
    TabViewModule,
    ToolbarModule
} from 'primeng/primeng';

import { GroupListComponent } from "./group-list.component";
import { GroupService } from "./group.service";

@NgModule({
    declarations: [GroupListComponent],   
    imports: [
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        FileUploadModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        SpinnerModule
    ],
    providers: [GroupService]
})
export class GroupsModule { }