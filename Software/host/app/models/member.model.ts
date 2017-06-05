import { KeyModel, ISelected } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Участник
 */
export class MemberModel extends KeyModel implements ISelected {
    
    name: string;
    jobTitle: string;   
    place: string;
    role: string;
    lockedInt: number;
    selected: boolean;

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.jobTitle = undefined;      
        this.role = undefined;
        this.role = undefined;
        this.lockedInt = 0;
    }
}