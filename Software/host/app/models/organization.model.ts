import { ISelected, KeyModel } from './index';

/**
 * Модель. Организация
 */
export class OrganizationModel extends KeyModel implements ISelected {

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
        this.selected = false;
    }
    
}