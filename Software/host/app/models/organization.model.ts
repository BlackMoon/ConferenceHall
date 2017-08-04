import { KeyModel } from './index';

/**
 * Команда мульти-обработки узлов
 */
export class NodeGroupCommand {
    employeeIds: number[];
    organizationIds: number[];    
}

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
    logo: File;
    name: string;
    
    constructor() {

        super();

        this.address = undefined;
        this.code = undefined;
        this.description = undefined;
        this.name = undefined;
    }
    
}