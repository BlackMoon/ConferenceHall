import { KeyModel, SchemeModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Сообщения конференции
 */
export class ConfMessageModel extends KeyModel {

    confId: number;
    message?: string;
    active?: boolean;

    constructor() {

        super();

        this.confId = undefined;
        this.message = undefined;
        this.active = undefined;
    }
}
