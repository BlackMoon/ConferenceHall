import { KeyModel } from './index';

export enum GroupType { User, Favorites, Global };

/**
 * Модель. Группа элементов
 */
export class GroupModel extends KeyModel {
    
    name: string;
    icon?: string;
    groupType: GroupType;

    constructor() {
        super();
    
        this.icon = undefined;
        this.name = undefined;
        this.groupType = GroupType.Global;
    }
}