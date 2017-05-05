import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from "../../common/logger";

import { SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit, OnDestroy, OnInit {

    @Input()
    schemeid:number;

    canvas: any;
    canvasbox: any;
    
    schemeForm: FormGroup;
    schemeFormVisible: boolean;

    @ViewChild('canvas')
    canvasElRef: ElementRef;

    @ViewChild('canvasbox')
    canvasboxElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private schemeService: SchemeService) { }

    ngAfterViewInit() {
        this.onResize();
    }

    ngOnInit() {

        this.schemeForm = this.fb.group({
            id: [null],
            hallId: [null],
            name: [null]
        });

        this.canvasbox = this.canvasboxElRef.nativeElement;

        this.schemeService
            .get(this.schemeid)
            .subscribe((scheme: SchemeModel) => {
                    this.canvasbox.insertAdjacentHTML('beforeend', scheme.plan);
                    
                    this.canvas = this.canvasbox.querySelector('svg');
                    if (this.canvas != null) {                        
                        this.canvas.addEventListener("click", this.canvasClick);
                        //this.canvas.classList.add("ui-toolbar");
                        this.canvas.style.height = this.canvas.style.width = "100%";
                    }

                    this.schemeForm.patchValue(scheme);
                },
                error => this.logger.error(error));
    }

    ngOnDestroy() {
        this.canvas.removeEventListener("click");
    }

    canvasClick(event) {
        debugger;
        console.log(event.x);
    }

    saveScheme(scheme) {
        debugger;
        scheme.plan = this.canvas.outerHTML;

        this.schemeService
            .update(scheme)
            .subscribe(_ => {},
                    error => this.logger.error(error));
    }

    selectBtnClick() {
        debugger;
    }

    onResize() {
        this.canvasbox.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.canvasbox.offsetTop}px`;
    }
}