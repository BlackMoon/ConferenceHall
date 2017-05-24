import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from "../../common/logger";
import { AppointmentModel } from '../../models';
import { HallService } from '../halls/hall.service';

@Component({
    selector: "appointment-dialog",
    encapsulation: ViewEncapsulation.None,
    styles: [`.ui-datepicker.ui-datepicker-inline { width: 100% }`],
    template: `<p-dialog header="Назначить на" [(visible)]="visible" modal="modal" minHeight="320" minWidth="300" width="400" dismissableMask="true" [responsive]="true" (onHide)="onHide()">                
                <form [formGroup]="appointmentForm" (ngSubmit)="save($event, appointmentForm.value)">
                    <div class="ui-g">                    
                        <div class="ui-g-12" style="padding: .5em 0">                        
                            <p-dropdown [options]="halls" formControlName="hallid" placeholder="Выберите холл" [style]="{'width':'100%'}"></p-dropdown>                        
                        </div>
                        <div class="ui-g-12 ui-g-nopad">                        
                            <p-calendar [inline]="true" formControlName="start" [style]="{'width':'100%'}"></p-calendar>                        
                        </div>                    
                    </div>
                    <p-footer>
                        <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                            <button type="button" pButton icon="fa-close" (click)="visible=false" label="Отмена"></button>
                            <button type="submit" pButton icon="fa-check" label="ОК"></button>
                        </div>
                    </p-footer>
                </form>
              </p-dialog>`
})
export class AppointmentDialogComponent implements OnInit {

    halls: any[];

    @Input() visible: boolean;

    // event Handlers
    @Output() closed: EventEmitter<AppointmentModel> = new EventEmitter();

    appointmentForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private hallService: HallService,
        private logger: Logger) { }

    ngOnInit() {

        this.appointmentForm = this.fb.group({
            hallid: [null],
            start: [null]
        });

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls.map(h => <any>{ label: h.name,  value: h.id}),
                error => this.logger.error(error));
    }

    onHide() {
        this.closed.emit();
    }

    save(event, appointment) {
        
        this.closed.emit(appointment);
        this.visible = false;
    }

    /**     
     * @param hallid
     */
    show(a: AppointmentModel) {
        this.appointmentForm.patchValue({ hallid: a.hallId, start: a.start });
        this.visible = true;
    }
}