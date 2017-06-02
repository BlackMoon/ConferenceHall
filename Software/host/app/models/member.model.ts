import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Участник
 */
export class MemberModel extends KeyModel {

    name: string;
    job_title: string;
   
    place: string;
    role: string;
    lockedInt: number;
    selected: boolean;

    constructor() {

        super();

        this.name = undefined;
        this.job_title = undefined;      
        this.role = undefined;
        this.role = undefined;
        this.lockedInt = 0;
    }
}