import { KeyModel } from "./index";
import { JsonProperty } from '../common/map-utils';

// для JsonProperty необходимо объявить через require()
import sysuser = require("./sysuser.model");
import SysUserModel = sysuser.SysUserModel;

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
     * Наименование организации
     */
    job: string;

    /**
     * Должность
     */
    position: string;    

    /**
    * Системный пользователь
    */
    @JsonProperty({ clazz: SysUserModel })
    user: SysUserModel;

    /**
    * Контакты
    */
    @JsonProperty({ clazz: ContactModel })
    contacts?: ContactModel[];    

    constructor() {

        super();
        this.id = undefined;
        this.name = undefined;
        this.orgId = undefined;
        this.position = undefined;

        this.user = undefined;
        this.contacts = undefined;
    }
}