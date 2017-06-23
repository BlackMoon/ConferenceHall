import { Component, Input, OnInit } from '@angular/core';
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
export class SchemeTableComponent implements OnInit {

    editMode: boolean;
    
    schemeForm: FormGroup;

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

        this.schemeForm = this.fb.group({
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
                    this.schemeForm.reset();
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

    removeRows() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить выбранные записи?`,
            accept: _ => {

                let c = { ids: this.selectedSchemes.map(s => s.id) };

                this.schemeService
                    .delete(c)
                    .subscribe(
                    _ => {

                        this.selectedSchemes.forEach(s => {
                            let ix = this.schemes.findIndex(n => n.id === s.id);
                            this.schemes.splice(ix, 1);
                        });

                        this.selectedSchemes.length = 0;
                    },
                    error => this.logger.error2(error));
            }
        });
    }

    selectRow(e) {

        !this.editMode && this.router.navigate(["/schemes", e.data["id"]]);
    }
}