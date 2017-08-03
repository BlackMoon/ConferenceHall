import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataTableModule } from 'primeng/primeng';
import { UiModule } from '../../common/ui/ui.module';

import { GroupTableComponent } from "./group-table.component";
import { GroupService } from "./group.service";

@NgModule({
    declarations: [GroupTableComponent],   
    imports: [
        CommonModule,
        DataTableModule,
        UiModule
    ],
    providers: [GroupService]
})
export class GroupsModule { }