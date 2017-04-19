import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HallModel, SchemeModel } from '../../models';
import { HallService } from './hall.service';

@Component({
    templateUrl: `hall-detail.component.html`
})
export class HallDetailComponent implements OnInit {

    hallform: FormGroup;
    schemes: SchemeModel[];

    constructor(
        private fb: FormBuilder,
        private hallService: HallService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.hallform = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            description: [null],
            size: this.fb.group({
                h: [null],
                w: [null]
            })
        });

        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.hallService.get(+params['id']))
            .subscribe((hall: HallModel) => {
                this.schemes = hall.schemes;
                this.hallform.patchValue(hall);
            });
    }

    cancel() {
        this.location.back();
    }

    editScheme(id) {
        this.router.navigate(['scheme', id]);
    }

    save(hall) {

        this.hallService[hall.id ? 'update' : 'add'](hall)
            .subscribe(_ => this.location.back());
    }
}