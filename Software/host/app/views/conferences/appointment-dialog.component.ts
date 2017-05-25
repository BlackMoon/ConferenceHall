import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from "../../common/logger";
import { AppointmentModel } from '../../models';
import { HallService } from '../halls/hall.service';

@Component({
    selector: "appointment-dialog",
    encapsulation: ViewEncapsulation.None,
    styles: [`.ui-datepicker.ui-datepicker-inline { width: 100% }`,
            `.ui-datepicker.ui-datepicker-timeonly { width: 120px }`],
    templateUrl: "appointment-dialog.component.html" 
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
            hallId: [null],
            duration: [new Date(0, 0, 0, 1)],       // 1 hour
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

        let duration:Date = appointment.duration;
        appointment.duration = `${duration.getHours()}:${duration.getMinutes()}:00`;

        this.closed.emit(appointment);
        this.visible = false;
    }

    /**     
     * @param hallid
     */
    show(a: AppointmentModel) {
        this.appointmentForm.patchValue({ hallId: a.hallId, start: a.start });
        this.visible = true;
    }
}