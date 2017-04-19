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
 * Модель. Схема халла
 */
export class HallSchemeModel extends KeyModel {
    name: string;
}


/**
 * Модель. Конференц-халл
 */
export class HallModel extends KeyModel {
   
    name: string;
    description?: string;

    @JsonProperty('size')
    size?: Size;

    @JsonProperty({ clazz: HallSchemeModel })
    schemes?: HallSchemeModel[];

    constructor() {

        super();
        
        this.name = undefined;
        this.description = undefined;
        this.size = undefined;
        this.schemes = undefined;
    }
}