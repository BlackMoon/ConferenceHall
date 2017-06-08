import { KeyModel } from './index';

/**
 * Модель. Организация
 */
export class OrganizationModel extends KeyModel {

    address: string;
    code: string;
    description: string;
    name: string;

    constructor() {

        super();

        this.address = undefined;
        this.code = undefined;
        this.description = undefined;
        this.name = undefined;
    }
    
}