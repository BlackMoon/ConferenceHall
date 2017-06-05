import { KeyModel, ISelected } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Состояние участника
 */
export enum MemberState { Invited, Registered, Confirmed };

/**
 * Модель. Участник
 */
export class MemberModel extends KeyModel implements ISelected {

    /**
     * ФИО
     */
    name: string;

    /**
     * Должность
     */
    jobTitle: string;   

    /**
     * Место
     */
    seat: string;

    /**
     * Роль (для пользователей)
     */
    role: string;

    /**
     * Состояние (в режиме конференции)
     */
    state: MemberState;

    lockedInt: number;
    selected: boolean;

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.jobTitle = undefined;      
        this.role = undefined;
        this.seat = undefined;
        this.state = MemberState.Invited;
        this.lockedInt = 0;
    }
}