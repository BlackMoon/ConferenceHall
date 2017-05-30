import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Клиент
 */
export class MemberModel extends KeyModel {

    name: string;
    jobTitle: string;
    emailsList: string[];
    phonesList: string[];
    role: string;
    locked: boolean;
    selected: boolean;

    constructor() {

        super();
        this.name = undefined;
        this.jobTitle = undefined;
        this.emailsList = undefined;
        this.phonesList = undefined;
        this.role = undefined;
        this.locked = undefined;

     
    }
}