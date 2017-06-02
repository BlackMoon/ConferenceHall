import { ISelected, KeyModel, SchemeModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Конференц-холл
 */
export class HallModel extends KeyModel implements ISelected {
   
    name: string;
    description?: string;
    selected: boolean;
    height?: number;
    width?: number;

    @JsonProperty({ clazz: SchemeModel })
    schemes?: SchemeModel[];

    constructor() {

        super();
        
        this.name = undefined;
        this.description = undefined;
        this.selected = false;
        this.height = 2;
        this.width = 2;

        this.schemes = undefined;
    }

    area = (): string => `(Размеры: ${this.width}м x ${this.height}м)`;
}