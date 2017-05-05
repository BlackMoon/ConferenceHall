import { isDevMode, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";

import { ElementModel, SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

const dragType = "element";

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
        private schemeService: SchemeService) {}

    ngAfterViewInit() {
        this.onResize();
    }

    ngOnInit() {

        this.schemeForm = this.fb.group({
            id: [null],
            name: [null, Validators.required]
        });

        this.canvasbox = this.canvasboxElRef.nativeElement;

        this.schemeService
            .get(this.schemeid)
            .subscribe((scheme: SchemeModel) => {
                    this.canvasbox.insertAdjacentHTML('beforeend', scheme.plan);
                    
                    this.canvas = this.canvasbox.querySelector('svg');

                    if (this.canvas != null) {
                        // размеры в см
                        this.canvas.setAttribute("viewbox", `0 0 ${scheme.width * 100} ${scheme.height * 100}`);
                        this.canvas.style.height = this.canvas.style.width = "100%";

                        this.canvas.addEventListener("mousedown", this.mouseDown);
                    }

                    this.schemeForm.patchValue(scheme);
                },
                error => this.logger.error(error));
    }

    ngOnDestroy() {
        this.canvas.removeEventListener("mousedown");
    }

    mouseDown(event) {
        //debugger;
        console.log(event.x);
    }

    mouseMove(event) {
        //debugger;
        //console.log(event.offsetX);
    }

    drop(event) {
        debugger;
        let element: ElementModel = JSON.parse(event.dataTransfer.getData(dragType));

        let shape = document.createElementNS(this.canvas.namespaceURI, "image");
        // размеры в см
        shape.setAttributeNS(null, "height", `${element.height * 100}`);
        shape.setAttributeNS(null, "width", `${element.width * 100}`);
        shape.setAttributeNS("http://www.w3.org/1999/xlink", "href", isDevMode() ? `http://webtest.aquilon.ru:810/api/thumbnail/${element.id}` : `/api/thumbnail/${element.id}`);
        shape.setAttributeNS(null, "x", event.offsetX);
        shape.setAttributeNS(null, "y", event.offsetY);

        this.canvas.appendChild(shape);
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