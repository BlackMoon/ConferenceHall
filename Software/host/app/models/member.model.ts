﻿import { KeyModel, ISelected } from './index';
import { JsonProperty } from '../common/map-utils';
import { ContactModel } from '../models';
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
     * Состояние (в режиме конференции)
     */
    memberState: MemberState;

    /**
     * Наименование организации
     */
    organization: string;

    /**
    * Роль (для пользователей)
     */
    role: string;
    
    /**
     * Место
     */
    seat: string;

    
    /**
    * Контакты
    */
    contacts: ContactModel[];

    lockedInt: number;
    selected: boolean;

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.jobTitle = undefined;      
        this.memberState = MemberState.Invited;
        this.organization = undefined;
        this.role = undefined;
        this.seat = undefined;
        this.lockedInt = 0;
        this.contacts = [];
    }
}