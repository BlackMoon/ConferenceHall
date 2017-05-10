import { KeyModel } from './index';
/**
 * Модель. Схема холла
 */
export class SchemeModel extends KeyModel {

    hallId: number;
    gridInterval: number;
    height: number;
    width: number;

    name: string;
    plan: string;   

    constructor() {
        super();

        this.name = undefined;
    }
}