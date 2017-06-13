import { KeyModel } from "./index";

/**
 * Модель. Контакт
 */
export class ContactModel extends KeyModel
{

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