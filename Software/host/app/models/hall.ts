/**
 * Модель. Конфенец-халл
 */

export class Size {
    h: number;
    w: number;

    toString = (): string => `(Размер: ${this.w} x ${this.h})`;
}

export class HallModel {
    id: number;
    name: string;
    description?: string;
    size?: Size;
}