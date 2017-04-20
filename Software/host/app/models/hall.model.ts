import { KeyModel, SchemeModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Конференц-холл
 */
export class HallModel extends KeyModel {
   
    name: string;
    description?: string;
    height?: number;
    width?: number;

    @JsonProperty({ clazz: SchemeModel })
    schemes?: SchemeModel[];

    constructor() {

        super();
        
        this.name = undefined;
        this.description = undefined;
        this.height = 2;
        this.width = 2;
        this.schemes = undefined;
    }

    area = (): string => `(Размеры: ${this.width}м x ${this.height}м)`;
}