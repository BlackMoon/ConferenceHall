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

//import { MemberDetailComponent } from './member-detail.component';
import { MemberListComponent } from './member-list.component';
//import { MemberTableComponent } from './member-table.component';
import { MemberRoutingModule } from './members-routing.module';
import { MemberService } from './member.service';
import { OrgMemberTableComponent } from './org-member-table.component';
import { OrganizationsModule } from '../organizations/organizations.module';

@NgModule({
   // declarations: [MemberDetailComponent, MemberListComponent, MemberTableComponent, OrgMemberTableComponent],
   // exports: [MemberListComponent, MemberTableComponent, OrgMemberTableComponent],
    declarations: [ MemberListComponent,OrgMemberTableComponent],
    exports: [MemberListComponent, OrgMemberTableComponent],
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
