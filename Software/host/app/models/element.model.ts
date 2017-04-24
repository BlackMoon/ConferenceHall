import { KeyModel } from './index';

/**
 * Модель. Группа элементов
 */
export class ElementGroupModel extends KeyModel {

    code: string;
    name: string;
    icon?: string;
}

/**
 * Модель. Элемент схемы
 */
export class ElementModel extends ElementGroupModel {
    
    height?: number;
    width?: number;

    constructor() {
        super();

        this.code = undefined;
        this.name = undefined;
        this.height = 1;
        this.width = 1;
    }
}