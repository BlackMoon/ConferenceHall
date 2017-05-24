import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Logger } from "../../common/logger";
import { HallService } from '../halls/hall.service';

@Component({
    selector: "appointment-dialog",
    styleUrls: ["appointment-dialog.component.css"],
    template: `<p-dialog header="Назначить на" [(visible)]="visible" modal="modal" minHeight="320" minWidth="300" dismissableMask="true" [responsive]="true" (onHide)="onHide()">                
                <div class="ui-g">                    
                    <div class="ui-g-12" style="padding: .5em 0">                        
                        <p-dropdown [options]="halls" placeholder="Выберите холл" [style]="{'width':'100%'}"></p-dropdown>                        
                    </div>
                    <div class="ui-g-12 ui-g-nopad">                        
                        <p-calendar [inline]="true" [style]="{'width':'100%'}"></p-calendar>                        
                    </div>                    
                </div>
                <p-footer>
                    <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                        <button type="button" pButton icon="fa-close" (click)="visible=false" label="Отмена"></button>
                        <button type="button" pButton icon="fa-check" (click)="okButtonClick()" label="ОК"></button>
                    </div>
                </p-footer>
              </p-dialog>`
})
export class AppointmentDialogComponent implements OnInit {

    halls: any[];

    @Input() visible: boolean;

    // event Handlers
    @Output() closed: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private hallService: HallService,
        private logger: Logger) { }

    ngOnInit() {
        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls.map(h => <any>{ label: h.name,  value: h.id}),
                error => this.logger.error(error));
    }

    onHide() {
        this.closed.emit();
    }

    okButtonClick() {
        this.closed.emit(true);
        this.visible = false;
    }

    show() {
        this.visible = true;
    }
}