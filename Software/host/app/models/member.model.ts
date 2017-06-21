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

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.job = undefined;      
        this.memberState = MemberState.Invited;
        this.position = undefined;
        this.seat = undefined;
        this.oldSeat = undefined;
    }
}
