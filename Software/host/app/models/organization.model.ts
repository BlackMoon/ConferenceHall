import { ISelected, KeyModel } from './index';

/**
 * Элемент дерева OrganizationsTree
 */
export class OrganizationNode extends KeyModel {
    description: string;
    name: string;
}


/**
 * Модель. Организация
 */
export class OrganizationModel extends KeyModel {

    address: string;
    code: string;
    description: string;
    name: string;
    selected: boolean;
    constructor() {

        super();

        this.address = undefined;
        this.code = undefined;
        this.description = undefined;
        this.name = undefined;
    }
    
}