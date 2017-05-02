import { Component, EventEmitter,  OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        private mediator: Mediator) { }

    ngOnInit() {

        this.elementform = this.fb.group({
            name: [null, Validators.required],
            height: [1, Validators.required],
            width: [1, Validators.required]
        });
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