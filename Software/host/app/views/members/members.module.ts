import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
    AccordionModule,
    ButtonModule,
    DataGridModule,
    DataListModule,
    DataTableModule,
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

import { MemberListComponent } from './member-list.component';
import { MemberDetailComponent } from './member-detail.component';
import { MemberRoutingModule } from './members-routing.module';
import { MemberService } from './member.service';

   

@NgModule({
        declarations: [MemberDetailComponent, MemberListComponent],
        exports: [DataTableModule, ButtonModule, FieldsetModule, InputTextModule, InputTextareaModule, SpinnerModule, MemberListComponent],
    imports: [
        AccordionModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        DataTableModule,
        DragDropModule,
        DropdownModule,       
        FieldsetModule,
        FormsModule,      
        InputTextModule,
        InputTextareaModule,
        MenuModule,
        PanelModule,
        ReactiveFormsModule,
        MemberRoutingModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule],
    providers: [MemberService]
})
export class MembersModule { }
