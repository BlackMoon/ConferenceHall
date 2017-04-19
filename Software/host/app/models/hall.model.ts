import { KeyModel } from './index';
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
 * Модель. Схема холла
 */
export class SchemeModel extends KeyModel {
    name: string;

    constructor() {
        super();

        this.name = undefined;
    }
}


/**
 * Модель. Конференц-холл
 */
export class HallModel extends KeyModel {
   
    name: string;
    description?: string;

    @JsonProperty('size')
    size?: Size;

    @JsonProperty({ clazz: SchemeModel })
    schemes?: SchemeModel[];

    constructor() {

        super();
        
        this.name = undefined;
        this.description = undefined;
        this.size = undefined;
        this.schemes = undefined;
    }
}