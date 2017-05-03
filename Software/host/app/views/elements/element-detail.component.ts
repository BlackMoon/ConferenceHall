import { Component, EventEmitter,  OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUpload } from 'primeng/components/fileupload/fileupload';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-detail',
    styleUrls: ['element-detail.component.css'],
    templateUrl: 'element-detail.component.html'
})
export class ElementDetailComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: FileUpload;

    elementform: FormGroup;

    constructor(
        private elementService: ElementService,
        private fb: FormBuilder,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute) { }

    ngOnInit() {

        this.elementform = this.fb.group({
            name: [null, Validators.required],
            height: [1, Validators.required],
            width: [1, Validators.required]
        });

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = +params['id'];
                return key ? this.elementService.get(key) : Observable.empty();
            })
            .subscribe((element: ElementModel) => this.elementform.patchValue(element));
    }

    save(element) {

        element.image = this.fileUpload.files[0];

        this.elementService
            .add(element)
            .subscribe(
                _ => this.mediator.broadcast("elementDetail_itemSaved"),
                error => this.logger.error(error));
    }
}