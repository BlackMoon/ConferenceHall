import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'primeng/primeng';
import { HubService } from '../../common/hub-service';
import { MemberService } from '../members/member.service';
import { ScreenRoutingModule } from './screen-routing.module';
import { SchemesModule } from '../schemes/schemes.module';
import { ScreenComponent } from './screen.component';
import { MemberScreenComponent } from './member-screen.component';
import { ScreenService } from './screen.service';

import { UiModule } from '../../common/ui/ui.module';

@NgModule({
    declarations: [ MemberScreenComponent, ScreenComponent ],
    imports: [CommonModule, DataTableModule, SchemesModule, ScreenRoutingModule, UiModule],
    providers: [HubService, MemberService, ScreenService]
})
export class ScreenModule { }