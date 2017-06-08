import { KeyModel } from "./index";
/**
 * Модель. Контакт
 */
export class ContactModel extends KeyModel {
    address: string;
    kind: string;
    active: boolean;

    constructor() {
        super();
        this.address = undefined;
        this.kind = undefined;
        this.active = false;
    }
}
