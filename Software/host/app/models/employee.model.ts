import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';
import { ContactModel } from '../models';


/**
 * Модель. Сотрудник
 */
export class EmployeeModel extends KeyModel {

   
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
    * Роль (для пользователей)
     */
    role: string;

    /**
    * Контакты
    */
    contacts: ContactModel[];

    locked: boolean;
    selected: boolean;

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.job = undefined;
        this.position = undefined;
        this.role = undefined;
        this.locked = false;
        this.contacts = [];
    }
}