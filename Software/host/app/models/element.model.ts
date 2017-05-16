import { KeyModel } from './index';

/**
 * Константы для операций Drag & Drop
 */
export const dragOffset = "offset";
export const dragType = "element";

/**
 * Команда мульти-обработки элементов
 */
export class ElementGroupCommand {
    ids: number[];
    groupId?: number;
}


/**
 * Модель. Элемент схемы
 */
export class ElementModel extends KeyModel {
    
    selected: boolean = false;

    image: File;
    name: string;

    height?: number;
    width?: number;

    constructor() {
        super();
        
        this.name = undefined;
        this.height = 1;
        this.width = 1;
    }
}