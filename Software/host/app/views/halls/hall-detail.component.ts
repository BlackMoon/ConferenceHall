import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { HallModel, SchemeModel } from '../../models';
import { HallService } from './hall.service';

@Component({
    templateUrl: 'hall-detail.component.html'
})
export class HallDetailComponent implements OnInit {
    
    hallForm: FormGroup;
    schemes: SchemeModel[];

    constructor(
        private fb: FormBuilder,
        private hallService: HallService,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.hallForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            description: [null],
            height: [2, Validators.required],
            width: [2, Validators.required]
        });

        this.route.params
            
            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.hallService.get(key) : Observable.empty();
            })
            .subscribe((hall: HallModel) => {
                this.schemes = hall.schemes;
                this.hallForm.patchValue(hall);
            });
    }

    editScheme(id) {
        this.router.navigate(['schemes', id]);
    }

    save(event, hall) {

        event.preventDefault();

        this.hallService[hall.id ? 'update' : 'add'](hall)
            .subscribe(_ => this.location.back(),
                       error => this.logger.error(error));
    }
}