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
import { MemberTableComponent } from './member-table.component';
import { MemberRoutingModule } from './members-routing.module';
import { MemberService } from './member.service';
import { OrganizationsModule } from '../organizations/organizations.module';

@NgModule({
    declarations: [MemberListComponent, MemberTableComponent],
    exports: [MemberListComponent, MemberTableComponent],
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
        MemberRoutingModule,
        MenuModule,
        OrganizationsModule,
        PanelModule,
        ReactiveFormsModule,
        SpinnerModule,
        TabViewModule,
        ToggleButtonModule,
        ToolbarModule
    ],
    providers: [MemberService]
})
export class MembersModule { }
