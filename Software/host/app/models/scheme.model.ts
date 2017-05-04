import { KeyModel } from './index';
/**
 * Модель. Схема холла
 */
export class SchemeModel extends KeyModel {

    hallid: number;
    name: string;
    plan: string;
    height: number;
    width: number;

    constructor() {
        super();

        this.name = undefined;
    }
}