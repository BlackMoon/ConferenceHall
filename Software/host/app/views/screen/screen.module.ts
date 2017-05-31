import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataListModule, InputSwitchModule } from 'primeng/primeng';
import { ScreenRoutingModule } from './screen-routing.module';
import { ScreenComponent } from './screen.component';
import { ScreenService } from './screen.service';

@NgModule({
    declarations: [ScreenComponent],
    imports: [CommonModule, DataListModule, InputSwitchModule, ScreenRoutingModule],
    providers: [ScreenService]
})
export class ScreenModule { }