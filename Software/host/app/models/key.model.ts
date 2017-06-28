/**
 * Интервал
 */
export class Range<T> {
    lowerBound: T;
    upperBound: T;
}

export type TimeRange = Range<Date>;

/**
 * Интерфейс selected объекта
 */
// ReSharper disable InconsistentNaming
export interface Selected {
    selected: boolean;
}

/**
 * Базовая модель объекта
 */
export class KeyModel {
    id: number;

    constructor() {
        this.id = undefined;
    }
}

export class GroupCommand {
    ids: number[];
}