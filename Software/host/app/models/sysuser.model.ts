import { KeyModel } from './index';

/**
 * Роль пользователя
 */
export enum UserRole { User, PowerUser, Admin, System }

/**
 * Модель. Системный пользователь
 */
export class SysUserModel extends KeyModel  {

    locked: boolean;
    login: string;
    password: string;
    role: UserRole;

    constructor() {
        super();
    }
}