import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';
import { ContactModel } from '../models';

/**
 * Состояние участника
 */
export enum MemberState { Invited, Registered, Confirmed };

/**
 * Запрос. Поиск учстников
 */
export class FindMembersQuery {
    conferenceId?: number;
    organizationIds?: number[];
}


/**
 * Модель. Участник
 */
export class MemberModel extends KeyModel {

    /**
     * id сотрудника
     */
    employeeId: number;

    /**
     * ФИО
     */
    name: string;

    /**
     * Состояние (в режиме конференции)
     */
    memberState: MemberState;

    /**
     * Наименование организации
     */
    job: string;

    /**
     * Должность
     */
    position: string;  

    
    /**
     * Место
     */
    seat: string;

    /**
     * Пред. место
     */
    oldSeat: string;

    /**
     * Confirmed property form inputs     
     */
    get confirmed(): boolean {
        return this.memberState === MemberState.Confirmed;
    }

    constructor() {

        super();

        this.id = undefined;
        this.employeeId = undefined;
        this.name = undefined;
        this.job = undefined;      
        this.memberState = MemberState.Invited;
        this.position = undefined;
        this.seat = undefined;
        this.oldSeat = undefined;
    }
}
