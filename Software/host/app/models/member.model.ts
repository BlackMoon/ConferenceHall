import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Клиент
 */
export class MemberModel extends KeyModel {

    name: string;
    job_title: string;
    emails_list: string[];
    phones_list: string[];
    role: string;
    locked: boolean;
    selected: boolean;

    constructor() {

        super();
        this.name = undefined;
        this.job_title = undefined;
        this.emails_list = undefined;
        this.phones_list = undefined;
        this.role = undefined;
        this.locked = undefined;

     
    }
}