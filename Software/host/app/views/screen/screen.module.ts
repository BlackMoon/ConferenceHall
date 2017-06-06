import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataListModule } from 'primeng/primeng';
import { HubService } from '../../common/hub-service';
import { MembersModule } from '../members/members.module';
import { ScreenRoutingModule } from './screen-routing.module';
import { SchemesModule } from '../schemes/schemes.module';
import { ScreenComponent } from './screen.component';
import { ScreenService } from './screen.service';

@NgModule({
    declarations: [ScreenComponent],
    imports: [CommonModule, DataListModule, MembersModule, SchemesModule, ScreenRoutingModule],
    providers: [HubService, ScreenService]
})
export class ScreenModule { }