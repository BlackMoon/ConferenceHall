import { Injectable } from '@angular/core';

/**
 * Хранилище
 */
@Injectable()
export class Storage {

    /**
     * пред. маршрут (для scheme.main.component.onPopState)
     */
    previousRoute: string;
}