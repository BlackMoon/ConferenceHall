import { KeyModel } from './index';


/**
 * Модель. Элемент схемы
 */
export class ElementModel extends KeyModel {
    
    favorite: boolean;

    image: File;
    name: string;

    height?: number;
    width?: number;

    constructor() {
        super();

        
        this.favorite = false;
        this.name = undefined;
        this.height = 1;
        this.width = 1;
    }
}