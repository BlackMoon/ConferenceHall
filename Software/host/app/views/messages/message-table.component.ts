import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { MessageModel } from '../../models';
import { MessageService } from './message.service';

@Component({
    selector: "message-table",
    templateUrl: "message-table.component.html"
})
export class MessageTableComponent {

    editMode: boolean;
    messageForm: FormGroup;

    messages: MessageModel[] = [];
    selectedMessages: MessageModel[] = [];

    // ReSharper disable InconsistentNaming
    private _conferenceId: number;

    get conferenceId(): number {
        return this._conferenceId;
    }

    @Input()
    set conferenceId(value: number) {
        this._conferenceId = value;
        value && this.loadMessages();
    }

    constructor(
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private logger: Logger,
        private messageService: MessageService) { }

    ngOnInit() {

        this.messageForm = this.fb.group({
            content: [null, Validators.required]    
        });
    }

    addMessage(message) {

        let min = this.messages.length + 1,
            max = 1e6,
            rand = min + Math.random() * (max + 1 - min);

        // random id for dataKey
        message.id = Math.floor(rand);
        message.active = true;

        this.messages.push(message);
        this.messageForm.reset();
    }

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedMessages.length = 0;
    }

    loadMessages() {

        this.messageService
            .getAll(this.conferenceId)
            .subscribe(
                messages => this.messages = messages,
                error => this.logger.error2(error)
            );
    }

    removeRows() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить выбранные записи?`,
            accept: _ => {

                this.selectedMessages.forEach(h => {
                    let ix = this.messages.findIndex(n => n.id === h.id);
                    this.messages.splice(ix, 1);
                });

                this.selectedMessages.length = 0;
            }
        });    
    }

}