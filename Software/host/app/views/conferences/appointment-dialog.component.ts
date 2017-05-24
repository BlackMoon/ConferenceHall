import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Logger } from "../../common/logger";
import { HallService } from '../halls/hall.service';

@Component({
    selector: "appointment-dialog",
    template: `<p-dialog header="Назначить на" [(visible)]="visible" modal="modal" width="300" dismissableMask="true" [responsive]="true" (onHide)="onHide()">                
                <div class="ui-grid ui-grid-responsive ui-grid-pad">                    
                    <div class="ui-grid-row">
                        <div class="ui-grid-col-12">
                            <p-calendar [inline]="true"></p-calendar>
                        </div>
                    </div>
                    <div class="ui-grid-row">
                        <div class="ui-grid-col-12">
                            <p-dropdown [options]="halls"></p-dropdown>
                        </div>
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