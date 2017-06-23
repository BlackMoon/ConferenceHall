import { KeyModel } from './index';


/**
* Действия. (Привязать, отвязать) пользователя к сотруднику
*/
export enum UserOperation { None, Bind, Unbind };


/**
 * Роль пользователя
 */
export enum UserRole { User, PowerUser, Admin, System }

export namespace UserRole {
    export function toName(role: UserRole) {

        let name: string = "";
        switch (role) {

            case UserRole.User:
                name = "Пользователь";
                break;

            case UserRole.PowerUser:
                name = "Опытный пользователь";
                break;

            case UserRole.Admin:
                name = "Администратор";
                break;

            case UserRole.System:
                name = "Система";
                break;
        }

        return name;
    }
}


/**
 * Модель. Системный пользователь
 */
export class SysUserModel extends KeyModel  {

    locked: boolean;
    login: string;
    password: string;
    operation: UserOperation;
    role: UserRole;

    constructor() {
        super();

        this.locked = false;
        this.login = undefined;
        this.role = undefined;
    }
}