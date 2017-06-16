import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { ContactModel } from '../../models';

const defaultKind = 'email';

@Component({
    selector: "contact-table",
    templateUrl: "contact-table.component.html"
})
export class ContactTableComponent implements OnInit {
    
    editMode: boolean;
    contactform: FormGroup;
    kinds: SelectItem[] = [{label: 'email', value: 'email'}, {label:'sms', value: 'sms'}];

    @Input()
    contacts: ContactModel[];
    selectedContacts: ContactModel[] = [];

    constructor(
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) { }

    ngOnInit() {
        this.contactform = this.fb.group({
            address: [null, Validators.required],
            kind: [defaultKind, Validators.required]
        });    
    }

    addContact(contact) {
        
        let min = this.contacts.length + 1,
            max = 1e6,
            rand = min + Math.random() * (max + 1 - min);

        // random id for dataKey
        contact.id = Math.floor(rand);
        contact.active = true;
        
        this.contacts.push(contact);
        this.contactform.reset({ kind: defaultKind });
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

                this.selectedContacts.forEach(h => {
                    let ix = this.contacts.findIndex(n => n.id === h.id);
                    this.contacts.splice(ix, 1);
                });

                this.selectedContacts.length = 0;
            }
        });
    }
}
