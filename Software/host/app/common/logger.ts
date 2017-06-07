import { EventEmitter, Output, Injectable } from '@angular/core';
import { Message } from 'primeng/primeng';

/**
 * Служба логирования
 */
@Injectable()
export class Logger {

    messages: Message[] = [];

    /**
     * Размер стека сообщений
     */
    stackSize: number = 1;

    constructor() {
        
        ["error", "info", "success", "warn"]
            .forEach(l => {
                this[l] = (s, d) => this.log(l, s, d);
                this[`${l}2`] = (m) => this.log2(l, m);
            });
    }

    // event Handlers
    @Output() msgReсeived: EventEmitter<Message[]> = new EventEmitter();

    error = (summary, detail?) => { }

    error2 = (message) => { }

    info = (summary, detail?) => { }

    success = (summary, detail?) => { }

    warn = (summary, detail?) => { }

    /**
     * Логгирование
     * @param level - уровень ['error', 'info', 'success', 'warn']
     * @param args - заголовок и текст
     */
    log(level, summary, detail) {

        this.messages.push({ severity: level || "info", summary: summary, detail: detail });
        // стек наполнен --> событие
        (this.messages.length >= this.stackSize) && this.msgReсeived.emit(this.messages.splice(0, this.stackSize));
    }

    log2(level, message) {

        message.severity = message.severity || level || "info";
        this.messages.push(message);
        // стек наполнен --> событие
        (this.messages.length >= this.stackSize) && this.msgReсeived.emit(this.messages.splice(0, this.stackSize));
    }

    clear() {
        this.messages = [];
    }
}