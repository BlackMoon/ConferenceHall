import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { DataTableModule, DropdownModule, InputSwitchModule, } from 'primeng/primeng';
import { MemberTableComponent } from './member-table.component';
import { MemberService } from './member.service';

import { UiModule } from '../../common/ui/ui.module';

@NgModule({
    declarations: [MemberTableComponent],
    exports: [ MemberTableComponent],
    imports: [ CommonModule, DataTableModule, DropdownModule, FormsModule, InputSwitchModule, UiModule ],
    providers: [MemberService]
})
export class MembersModule { }
