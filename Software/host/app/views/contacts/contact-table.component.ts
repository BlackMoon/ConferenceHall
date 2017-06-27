import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { ContactModel } from '../../models';
import { ContactService } from './contact.service';

const defaultKind = 'email';

@Component({
    selector: "contact-table",
    templateUrl: "contact-table.component.html"
})
export class ContactTableComponent implements OnInit {
    
    editMode: boolean;
    contactForm: FormGroup;

    @Input()
    employeeId: number;
    
    senders: SelectItem[];

    @Input()
    contacts: ContactModel[];
    selectedContacts: ContactModel[] = [];

    constructor(
        private confirmationService: ConfirmationService,
        private contactService: ContactService,
        private fb: FormBuilder,
        private logger: Logger) { }

    ngOnInit() {
        this.contactForm = this.fb.group({
            address: [null, Validators.required],
            kind: [defaultKind, Validators.required]
        });

        this.contactService
            .getSenders()
            .subscribe((senders:Map<string, string>) => {
                
                let keys = Object.keys(senders);
                this.senders = new Array(keys.length);

                for (let ix = 0; ix < keys.length; ix++) {
                    let k = keys[ix];
                    this.senders[ix] = <SelectItem>{ label: senders[k] || k, value: k };
                }

                this.contacts.forEach(c => c.name = senders[c.kind] || c.kind);
            });
    }

    addContact(contact) {       
       
        contact.active = true;
        contact.employeeId = this.employeeId;

        this.contactService
            .add(contact)
            .subscribe(
                key => {
                    contact.id = key;

                    let sender = this.senders.find(s => s.value === contact.kind);
                    sender && (contact.name = sender.label);

                    this.contacts.push(contact);
                    this.contactForm.reset();
                },
                error => this.logger.error2(error));        
    }

    changeActive(e, contact) {

        e.originalEvent.stopPropagation();

        this.contactService
            .changeActive(contact.id, e.checked)
            .subscribe(
                _ => contact.active = e.checked,
                error => this.logger.error2(error));
    }

    changeAddress(e, contact) {
        
        let address = e.currentTarget.value;

        if (address !== contact.address) {

            this.contactService
                .changeAddress(contact.id, address)
                .subscribe(
                   _ => contact.address = address,
                    error => this.logger.error2(error));
        }
    }

    changeKind(e, contact) {       

        this.contactService
            .changeKind(contact.id, e.value)
            .subscribe(
                _ => {
                    contact.kind = e.value;

                    let sender = this.senders.find(s => s.value === contact.kind);
                    sender && (contact.name = sender.label);
                },
                error => this.logger.error2(error));
    }

    changeEditMode() {
        
        this.editMode = !this.editMode;
        this.selectedContacts.length = 0;
    }

    removeRows() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить выбранные записи?`,
            accept: _ => {                

                this.contactService
                    .delete(this.selectedContacts.map(s => s.id))
                    .subscribe(
                    _ => {

                        this.selectedContacts.forEach(h => {
                            let ix = this.contacts.findIndex(n => n.id === h.id);
                            this.contacts.splice(ix, 1);
                        });

                        this.selectedContacts.length = 0;
                    },
                    error => this.logger.error2(error));
            }
        });
    }
}
