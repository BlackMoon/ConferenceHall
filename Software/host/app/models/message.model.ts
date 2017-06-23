import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Сообщения конференции
 */
export class MessageModel extends KeyModel {

    active: boolean;
    content: string;

    constructor() {

        super();

        this.active = false;
        this.content = undefined;
        
    }
}
