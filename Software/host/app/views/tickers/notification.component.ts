import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { EmployeeService } from '../employees/employee.service';
import { TickerService } from './ticker.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [
        ".ui-multiselect-filter-container { width: 85% }",
        ".ui-multiselect-panel {width: 50% } ",
        ".ui-panel-titlebar { display: none }",
        ".ui-panel-content.ui-widget-content { padding: 0 !important}"
    ],
    templateUrl: "notification.component.html"
})
export class NotificationComponent implements OnInit {

    conferenceId: number;
    loading: boolean;

    msgs: Message[] = [];
    recipients: SelectItem[] = [];

    sendMessageForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private tickerService: TickerService,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute) { }

    ngOnInit() {

        this.sendMessageForm = this.fb.group({
            selectedRecipients: [null, Validators.required],
            body: [null]
        });

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'confid' to a number
                this.conferenceId = params.hasOwnProperty("confid") ? +params["confid"] : undefined;
                return this.employeeService.getAll(this.conferenceId);
            })
            .subscribe(
                employees => {

                    this.recipients = employees.map(e => <SelectItem>{ label: e.name, value: e.id });
                    this.conferenceId && this.sendMessageForm.patchValue({ selectedRecipients: this.recipients.map(r => r.value) });
                },
                error => this.logger.error2(error));
    }

    addLink() {

        let body = (this.sendMessageForm.get("body").value || "") + `\n${document.location.origin}/conferences/${this.conferenceId}`;
        this.sendMessageForm.patchValue({ body: body });
    }

    send(e, m) {
        
        e.preventDefault();
        this.msgs.length = 0;
        this.loading = true;

        this.tickerService
            .notify(m.body, m.selectedRecipients)
            .subscribe(
                _ => {
                    this.loading = false;
                    this.msgs.push({ severity: "info", detail: "Уведомление отправлено" });
                },
                error => {
                    this.loading = false;

                    let lines = error.summary.split("<br>") || [];
                    lines.forEach(l => this.msgs.push({ severity: "error", detail: l }));
                });
    }
}