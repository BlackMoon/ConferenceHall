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

        message.active = true;
        message.conferenceId = this.conferenceId;

        this.messageService
            .add(message)
            .subscribe(
            key => {
                message.id = key;
                this.messages.push(message);
                this.messageForm.reset();
            },
            error => this.logger.error2(error));
    }

    changeActive(e, message) {
        
        e.originalEvent.stopPropagation();

        this.messageService
            .changeActive(message.id, e.checked)
            .subscribe(
                _ => message.active = e.checked,
                error => this.logger.error2(error));
    }

    changeContent(e, message) {

        let content = e.currentTarget.value;

        if (content !== message.content) {
            this.messageService
                .changeContent(message.id, content)
                .subscribe(
                _ => message.content = content,
                error => this.logger.error2(error));
        }
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

                let c = { ids: this.selectedMessages.map(s => s.id) };

                this.messageService
                    .delete(c)
                    .subscribe(
                    _ => {

                        this.selectedMessages.forEach(h => {
                            let ix = this.messages.findIndex(n => n.id === h.id);
                            this.messages.splice(ix, 1);
                        });

                        this.selectedMessages.length = 0;
                    },
                    error => this.logger.error2(error));
            }
        });    
    }
}