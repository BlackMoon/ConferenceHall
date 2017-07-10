import { KeyModel, GroupCommand, Selected } from './index';

/**
 * Команда мульти-обработки элементов
 */
export class ElementGroupCommand extends GroupCommand {
    groupId?: number;
}


/**
 * Модель. Элемент схемы
 */
export class ElementModel extends KeyModel implements Selected {
    
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