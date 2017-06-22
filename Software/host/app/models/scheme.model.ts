import { KeyModel } from './index';

/**
 * Команда копирования схемы
 */
export class CopyCommand extends KeyModel {
    
}

/**
 * Модель. Схема холла
 */
export class SchemeModel extends KeyModel {

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