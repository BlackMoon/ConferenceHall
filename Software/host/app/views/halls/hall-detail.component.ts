import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { HallModel } from '../../models';
import { HallService } from './hall.service';

@Component({
    templateUrl: `hall-detail.component.html`
})
export class HallDetailComponent implements OnInit {
    model: HallModel;
    hallform: FormGroup;

    constructor(
        private fb: FormBuilder,
        private hallService: HallService,
        private route: ActivatedRoute) { }

    ngOnInit() {

        this.hallform = this.fb.group({
            'name': [null, Validators.required],
            'description': [null],
            //'size.h': [null],
            //'size.w': [null]
        });

        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.hallService.get(+params['id']))
            .subscribe((hall: HallModel) => {
                debugger;
                this.hallform.setValue(hall);
            });
    }

    save(d) {
        debugger;
    }
}