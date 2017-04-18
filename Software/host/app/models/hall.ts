import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Конфенец-халл
 */

export class Size {
    h: number;
    w: number;

    constructor() {
        this.w = undefined;
        this.h = undefined;
    }

    public toString1 = (): string => `(Размер: ${this.w} x ${this.h})`;
}

export class HallModel {
   
    id: number;
    name: string;
    description?: string;

    @JsonProperty('size')
    size?: Size;

    constructor() {
        this.id = undefined;
        this.name = undefined;
        this.description = undefined;
        this.size = undefined;
    }
}