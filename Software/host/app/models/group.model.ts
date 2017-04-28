import { KeyModel } from './index';

enum GroupType { User, Favorites, Global };

/**
 * Модель. Группа элементов
 */
export class GroupModel extends KeyModel {
    
    name: string;
    icon?: string;
    grouptype: GroupType;

    constructor() {
        super();
    
        this.icon = undefined;
        this.name = undefined;
        this.grouptype = GroupType.Global;
    }
}