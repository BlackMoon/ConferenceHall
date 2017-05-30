import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ConferenceModel} from '../../models';
import { ConferenceService } from './conference.service';

@Component({
    templateUrl: 'conference-detail.component.html'
})
export class ConferenceDetailComponent implements OnInit {

    conferenceForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private conferenceService: ConferenceService,
        private location: Location,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.conferenceForm = this.fb.group({
            id: [null],
            subject: [null, Validators.required],
            description: [null]
        });

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.conferenceService.get(key) : Observable.empty();
            })
            .subscribe((conference: ConferenceModel) => {
                this.conferenceForm.patchValue(conference);
            });
    }

    save(event, conference) {

        event.preventDefault();

        this.conferenceService[conference.id ? 'update' : 'add'](conference)
            .subscribe(_ => this.location.back(),
            error => this.logger.error(error));
    }
}