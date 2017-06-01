import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ConfMessageModel } from '../../models/index';
import { ConfMessageService } from './confMessage.service';

@Component({
    selector: 'confMessage-list',
    templateUrl: 'confMessage-list.component.html'
        
})
export class ConfMessageListComponent {

    confMessageformVisible: boolean;
    confMessageform: FormGroup;

    @Input()
    confId: number;

    @Input()
    items: ConfMessageModel[];

    constructor(
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private logger: Logger,
        private router: Router,
        private confMessageService: ConfMessageService) { }

    ngOnInit() {

        this.confMessageform = this.fb.group({
            name: [null, Validators.required]
        });
    }

    addConfMessage(confMessage) {
       
        confMessage.hallId = this.confId;
        this.confMessageService
            .add(confMessage)
            .subscribe(
                key => {
                    confMessage.id = key;
                    this.items.push(confMessage);
                    this.confMessageformVisible = false;
                    this.confMessageform.reset();
                },
                error => this.logger.error(error));
    }
}