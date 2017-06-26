import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { MessageService } from './message.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    styles: [".ui-multiselect-filter-container { width: 85% }", ".ui-multiselect-panel {width: 50%}"],
    templateUrl: "send-message.component.html"
})
export class SendMessageComponent implements OnInit {

    recipients: SelectItem[];
    sendMessageForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private location: Location) { }

    ngOnInit() {
        this.sendMessageForm = this.fb.group({
            
        });
    }
}