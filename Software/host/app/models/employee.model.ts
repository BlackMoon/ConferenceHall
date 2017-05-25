import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Схема клиента
 */
export class EmployeeSchemeModel extends KeyModel {
    name: string;
}

/**
 * Модель. Клиент
 */
export class EmployeeModel extends KeyModel {

    name: string;
    jobTitle: string;
    emailsList: string[];
    phonesList: string[];

    @JsonProperty({ clazz: EmployeeSchemeModel })
    schemes?: EmployeeSchemeModel[];
    constructor() {

        super();
        this.name = undefined;
        this.jobTitle = undefined;
        this.emailsList = undefined;
        this.phonesList = undefined;
        this.schemes = undefined;
    }
}