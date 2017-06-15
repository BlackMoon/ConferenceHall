import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Контакт
 */
export class ContactModel extends KeyModel {

    kind: string;

    address: string;

    active: boolean;

    constructor() {
        super();

        this.kind = undefined;
        this.address = undefined;
        this.active = false;

    }
}

/**
 * Модель. Сотрудник
 */
export class EmployeeModel extends KeyModel {
   
    /**
     * ФИО
     */
    name: string;

    /**
     * id организации
     */
    orgId: number;

    /**
     * Должность
     */
    position: string;

    /**
    * Роль (для пользователей)
     */
    role: string;

    /**
    * Контакты
    */
    @JsonProperty({ clazz: ContactModel })
    contacts?: ContactModel[];

    locked: boolean;

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.orgId = undefined;
        this.position = undefined;
        this.role = undefined;
        this.locked = false;

        this.contacts = undefined;
    }
}