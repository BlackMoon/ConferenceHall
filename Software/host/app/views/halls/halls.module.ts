import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AutoCompleteModule, ButtonModule, DataGridModule, DataListModule, FieldsetModule, InputTextModule, InputTextareaModule, PanelModule, SpinnerModule, TabViewModule, ToolbarModule } from 'primeng/primeng';
import { SplitPaneModule } from 'ng2-split-pane';
import { HallDetailComponent } from './hall-detail.component';
import { HallListComponent } from './hall-list.component';
import { HallRoutingModule } from './halls-routing.module';
import { HallService } from './hall.service';
import { SchemeEditorComponent } from './scheme-editor.component';

@NgModule({
    declarations: [HallDetailComponent, HallListComponent, SchemeEditorComponent],
    exports: [ButtonModule, DataGridModule, FieldsetModule, InputTextModule, InputTextareaModule, SpinnerModule],
    imports: [
        AutoCompleteModule,
        ButtonModule,
        CommonModule,
        DataGridModule,
        DataListModule,
        FieldsetModule,
        FormsModule,
        HallRoutingModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        ReactiveFormsModule,
        SpinnerModule,
        SplitPaneModule,
        TabViewModule,
        ToolbarModule],
    providers: [HallService]
})
export class HallsModule { }
