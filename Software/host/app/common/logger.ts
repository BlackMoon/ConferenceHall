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
        
        ['error', 'info', 'success', 'warn']
            .forEach(l => this[l] = (s, d) => this.log(l, s, d));
    }

    // event Handlers
    @Output() msgReсeived: EventEmitter<Message[]> = new EventEmitter();

    error = (...args) => {}

    info = (...args) => { }

    success = (...args) => { }

    warn = (...args) => { }

    /**
     * Логгирование
     * @param level - уровень ['error', 'info', 'success', 'warn']
     * @param args - заголовок и текст
     */
    log(level, summary, detail) {

        this.messages.push({ severity: level || 'info', summary: summary, detail: detail });
        // стек наполнен --> событие
        (this.messages.length >= this.stackSize) && this.msgReсeived.emit(this.messages.splice(0, this.stackSize));
    }

    clear() {
        this.messages = [];
    }
}