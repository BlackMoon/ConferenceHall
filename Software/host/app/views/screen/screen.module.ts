import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CarouselModule, DataTableModule, ToolbarModule } from 'primeng/primeng';
import { HubService } from '../../common/hub.service';
import { MemberService } from '../members/member.service';
import { ScreenRoutingModule } from './screen-routing.module';
import { SchemesModule } from '../schemes/schemes.module';
import { ScreenComponent } from './screen.component';
import { ScreenTableComponent } from './screen-table.component';
import { MemberScreenComponent } from './member-screen.component';
import { ScreenService } from './screen.service';

import { DatexPipe } from "../../common/globals/pipes";
import { UiModule } from '../../common/ui/ui.module';

@NgModule({
    declarations: [ DatexPipe, MemberScreenComponent, ScreenComponent, ScreenTableComponent ],
    imports: [ButtonModule, CarouselModule, CommonModule, DataTableModule, SchemesModule, ScreenRoutingModule, ToolbarModule, UiModule],
    providers: [ HubService, MemberService, ScreenService]
})
export class ScreenModule { }