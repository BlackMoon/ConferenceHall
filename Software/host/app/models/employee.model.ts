

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
    job_title: string;
    emails_list: string[];
    phones_list: string[];

    @JsonProperty({ clazz: EmployeeSchemeModel })
    schemes?: EmployeeSchemeModel[];
    constructor() {

        super();
        this.name = undefined;
        this.job_title = undefined;
        this.emails_list = undefined;
        this.phones_list = undefined;
        this.schemes = undefined;
    }
}