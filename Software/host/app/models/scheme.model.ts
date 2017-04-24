import { KeyModel } from './index';
/**
 * Модель. Схема холла
 */
export class SchemeModel extends KeyModel {

    hallid: number;

    name: string;

    constructor() {
        super();

        this.name = undefined;
    }
}