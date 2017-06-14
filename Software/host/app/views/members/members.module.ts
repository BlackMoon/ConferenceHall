import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTableModule } from 'primeng/primeng';
import { MemberTableComponent } from './member-table.component';
import { MemberService } from './member.service';

@NgModule({
    declarations: [MemberTableComponent],
    exports: [ MemberTableComponent],
    imports: [ CommonModule, DataTableModule ],
    providers: [MemberService]
})
export class MembersModule { }
