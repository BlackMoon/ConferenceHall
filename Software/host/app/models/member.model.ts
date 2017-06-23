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
     * Наименование организации
     */
    job: string;

    /**
     * Должность
     */
    position: string;  

    /**
     * Пред. место
     */
    oldSeat: string;
    
    /**
     * Место
     */
    seat: string;

    /**
     * Состояние (в режиме конференции)
     */
    state: MemberState;

    constructor() {

        super();

        this.id = undefined;
        this.employeeId = undefined;
        this.name = undefined;
        this.job = undefined;      
        this.oldSeat = undefined;
        this.position = undefined;
        this.seat = undefined;
        this.state = MemberState.Invited;
    }
}
