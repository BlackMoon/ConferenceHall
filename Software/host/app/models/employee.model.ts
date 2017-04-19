

import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Клиент
 */
export class EmployeeModel extends KeyModel {

    name: string;
    description?: string;
    job_title: string;
    emails_list: string[];
    phones_list: string[];

    constructor() {

        super();
        this.name = undefined;
        this.description = undefined;
        this.job_title = undefined;
        this.emails_list = undefined;
        this.phones_list = undefined;
    }
}