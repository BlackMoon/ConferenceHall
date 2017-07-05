import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataListModule, DataTableModule } from 'primeng/primeng';

import { GroupListComponent } from "./group-list.component";
import { GroupTableComponent } from "./group-table.component";
import { GroupService } from "./group.service";

@NgModule({
    declarations: [GroupListComponent, GroupTableComponent],   
    imports: [
        CommonModule,
        DataListModule,
        DataTableModule
    ],
    providers: [GroupService]
})
export class GroupsModule { }