import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
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
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.hallform = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            description: [null],
            height: [2, Validators.required],
            width: [2, Validators.required]
        });

        this.route.params
            
            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = +params['id'];
                return key ? this.hallService.get(key) : Observable.empty();
            })
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
            .subscribe(_ => this.location.back(),
                       error => this.logger.error(error));
    }
}