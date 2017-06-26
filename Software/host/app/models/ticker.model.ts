import { KeyModel } from './index';

/**
 * Модель. Сообщения конференции
 */
export class TickerModel extends KeyModel {

    active: boolean;
    content: string;
    conferenceId: number;

    constructor() {

        super();

        this.active = false;
        this.content = undefined;
        
    }
}
