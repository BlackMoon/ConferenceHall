import { KeyModel } from './index';
/**
 * Модель. Элемент схемы
 */
export class ElementModel extends KeyModel {
    
    code: string;
    name: string;
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