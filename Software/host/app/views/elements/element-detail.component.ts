import { Component, EventEmitter,  OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUpload } from 'primeng/components/fileupload/fileupload';
import { Logger } from "../../common/logger";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    selector: 'element-detail',
    styleUrls: ['element-detail.component.css'],
    templateUrl: 'element-detail.component.html'
})
export class ElementDetailComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: FileUpload;

    // event Handlers
    @Output() itemSaved: EventEmitter<any> = new EventEmitter();

    elementform: FormGroup;
    uploadedFiles: any[] = [];

    constructor(
        private elementService: ElementService,
        private fb: FormBuilder,
        private logger: Logger) { }

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
                _ => this.itemSaved.emit(),
                error => this.logger.error(error));
    }
}