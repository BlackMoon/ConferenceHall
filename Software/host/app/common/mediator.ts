import { EventEmitter, Output, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

interface IBroadcastEvent {
    key: any;
    data?: any;
}

/**
 * Посредник между компонентами
 */
@Injectable()
export class Mediator {

    private eventBus = new Subject<IBroadcastEvent>();

    broadcast = (key: any, data: any) => this.eventBus.next({ key, data });

    /**
     * Подписаться на уведомление
     * @param name
     */
    on<T>(key: any): Observable<T> {

        return this.eventBus
            .asObservable()
            .filter(event => event.key === key)
            .map(event => <T>event.data);
    }
}