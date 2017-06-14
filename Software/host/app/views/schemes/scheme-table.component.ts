import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { SchemeModel } from '../../models/index';
import { SchemeService } from './scheme.service';

@Component({
    selector: 'scheme-table',
    templateUrl: 'scheme-table.component.html'

})
export class SchemeTableComponent {

    editMode: boolean;

    schemeformVisible: boolean;
    schemeform: FormGroup;

    @Input()
    hallId: number;

    @Input()
    schemes: SchemeModel[];

    selectedSchemes: SchemeModel[] = [];

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

        scheme.hallId = this.hallId;
        this.schemeService
            .add(scheme)
            .subscribe(
            key => {
                scheme.id = key;
                this.schemes.push(scheme);
                this.schemeformVisible = false;
                this.schemeform.reset();
            },
            error => this.logger.error2(error));
    }

    copyScheme(e, id: number) {

        e.stopPropagation();
        this.schemeService
            .copy({ id: id })
            .subscribe(scheme => this.schemes.push(scheme));
    }

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedSchemes.length = 0;
    }

    removeScheme(id: number, name?: string) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: _ => {
                return this.schemeService
                    .delete(id)
                    .subscribe(
                    _ => {

                        let ix = this.schemes.findIndex(s => s.id === id);
                        this.schemes.splice(ix, 1);
                    },
                    error => this.logger.error2(error));
            }
        });
    }
}