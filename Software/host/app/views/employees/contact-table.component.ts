import { Component, Input } from '@angular/core';
import { ContactModel } from '../../models';

@Component({
    selector: "contact-table",
    templateUrl: "contact-table.component.html"
})
export class ContactTableComponent {

    @Input()
    contacts: ContactModel[];
}
