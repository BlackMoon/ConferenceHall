import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { SchemeModel } from '../../models/index';
import { SchemeService } from './scheme.service';

@Component({
    selector: 'scheme-list',
    templateUrl: 'scheme-list.component.html'
        
})
export class SchemeListComponent {

    schemeformVisible: boolean;
    schemeform: FormGroup;

    @Input()
    hallid: number;

    @Input()
    items: SchemeModel[];

    constructor(
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private logger: Logger,
        private router: Router,
        private schemeService: SchemeService) { }

    ngOnInit() {

        this.schemeform = this.fb.group({
            name: [null, Validators.required]
        });
    }

    addScheme(scheme) {
       
        scheme.hallid = this.hallid;
        this.schemeService
            .add(scheme)
            .subscribe(
                key => {
                    scheme.id = key;
                    this.items.push(scheme);
                    this.schemeformVisible = false;
                    this.schemeform.reset();
                },
                error => this.logger.error(error));
    }

    removeScheme(id: number, name?: string) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () =>

                this.schemeService
                    .delete(id)
                    .subscribe(
                    _ => {

                        let ix = this.items.findIndex(s => s.id === id);
                        this.items.splice(ix, 1);
                    },
                    error => this.logger.error(error))

        });   
    }
}