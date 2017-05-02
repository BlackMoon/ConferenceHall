import { EventEmitter, Output, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs/subject";

interface IEmitEvent<T> {
    name: string;
    value: T;
}

/**
 * Посредник между компонентами
 */
@Injectable()
export class Mediator {

    private emitter: EventEmitter<any> = new EventEmitter();

    /**
     * Уведомить получателей
     * @param name
     */
    notify(name: string): Observable<any> {

        return this.emitter
            .asObservable()
            .filter((event: IEmitEvent<any>) => event.name === name)
            .map((event: IEmitEvent<any>) => event.value);
    }

    send<T>(name: string, value?: T) {

        let subject: IEmitEvent<T> = { name: name, value: value };
        
        this.emitter.emit(subject);
    }
}