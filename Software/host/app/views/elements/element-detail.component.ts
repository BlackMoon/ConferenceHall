import { Component, EventEmitter,  OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUpload } from 'primeng/components/fileupload/fileupload';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { ElementModel } from '../../models';
import { ElementService } from './element.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'element-detail',
    styles: [".ui-fileupload-row div:not(:first-child) { display: none; }",
             ".ui-spinner .ui-inputtext { width: 100%; }"],
    templateUrl: 'element-detail.component.html'
})
export class ElementDetailComponent implements OnInit {
    
    /**
     * id элемента
     */
    id?:number;
    elementForm: FormGroup;

    @ViewChild('fileUpload') fileUpload: FileUpload;

    constructor(
        private elementService: ElementService,
        private fb: FormBuilder,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute) { }

    get submitDisabled():boolean {

        let enabled: boolean = this.elementForm.valid;
        if (this.id === void 0) {
            enabled = enabled && (this.fileUpload.files.length > 0);
        }

        return !enabled;
    } 

    ngOnInit() {

        this.elementForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            height: [0.1, Validators.required],
            width: [0.1, Validators.required]
        });

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                params.hasOwnProperty("id") && (this.id = +params["id"]);
                return this.id ? this.elementService.get(this.id) : Observable.empty();
            })
            .subscribe((element: ElementModel) => this.elementForm.patchValue(element));
    }

    onSelect = () => this.fileUpload.styleClass = "";

    save(event, element) {
        
        event.preventDefault();
        
        (this.fileUpload.files.length > 0) && (element.image = this.fileUpload.files[0]);

        this.elementService[element.id ? "update" : "add"](element)
            .subscribe(
                _ => this.mediator.broadcast("elementDetail_itemSaved"),
                error => this.logger.error2(error));
    }
}