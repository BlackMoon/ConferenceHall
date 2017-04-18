import { JsonProperty } from '../common/map-utils';


/**
 * Модель. Размер
 */
export class Size {

    @JsonProperty('x')
    h: number;

    @JsonProperty('y')
    w: number;

    constructor() {
        this.w = undefined;
        this.h = undefined;
    }

    public area = (): string => `(Размеры: ${this.w}м x ${this.h}м)`;
}

/**
 * Модель. Конфенец-халл
 */
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