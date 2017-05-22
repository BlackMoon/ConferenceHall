/**
 * Интерфейс selected объекта
 */
export interface ISelected {
    selected: boolean;
}

/**
 * Базовая модель объекта
 */
export class KeyModel {
    id?: number;

    constructor() {
        this.id = undefined;
    }
}