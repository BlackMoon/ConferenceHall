import { isDevMode, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import Point from "../../common/point";

import { DragOffset, DragType, ElementModel, SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

const shapeClass = "el";

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit, OnDestroy, OnInit {
    
    canvas: any;
    canvasbox: any;    

    initialHeight: number;
    initialWidth: number;

    svgElement: HTMLElement = null;                // selected svgElement
    svgElementOffset: Point;
    
    schemeForm: FormGroup;
    schemeFormVisible: boolean;

    @Input()
    schemeid: number;

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
                // размеры в см
                this.initialHeight = scheme.height * 100;
                this.initialWidth = scheme.width * 100;                
                    
                this.canvas = this.canvasbox.querySelector('svg');

                if (this.canvas != null) {
                    // размеры в см
                    this.centerView();
                    this.canvas.style.height = this.canvas.style.width = "100%";
                                        
                    this.canvas
                        .addEventListener("mousemove", (event) => this.mouseMove(event));                        
                    this.canvas
                        .addEventListener("mouseup", (event) => this.mouseUp(event));                        

                    for (let img of this.canvas.querySelectorAll('image')) {
                        img.addEventListener("mousedown", (event) => this.mouseDown(event));
                    }
                }

                this.schemeForm.patchValue(scheme);
            },
            error => this.logger.error(error));
    }

    ngOnDestroy() {
        this.canvas.removeEventListener("mousemove");
        this.canvas.removeEventListener("mouseup");
    }

    mouseDown(event) {
        
        event.stopPropagation();
        this.svgElement = event.currentTarget;   

        let cr: ClientRect = this.svgElement.getBoundingClientRect();
        this.svgElementOffset = new Point(event.clientX - cr.left, event.clientY - cr.top);
    }

    mouseMove(event) {

        event.preventDefault();

        if (this.svgElement !== null) {
            let pt = this.canvas.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

            this.svgElement.setAttributeNS(null, "x", `${pt.x - this.svgElementOffset.x}`);
            this.svgElement.setAttributeNS(null, "y", `${pt.y - this.svgElementOffset.y}`);  
        }
    }

    mouseUp(event) {        
        this.svgElement = null;
    }

    drop(event) {
        
        let element: ElementModel = JSON.parse(event.dataTransfer.getData(DragType)),
            offset:Point = JSON.parse(event.dataTransfer.getData(DragOffset));

        let shape = document.createElementNS(this.canvas.namespaceURI, "image");
        shape.addEventListener("mousedown", (event) => this.mouseDown(event));

        // размеры в см
        shape.setAttributeNS(null, "height", `${element.height * 100}`);
        shape.setAttributeNS(null, "width", `${element.width * 100}`);        
        shape.setAttributeNS("http://www.w3.org/1999/xlink", "href", isDevMode() ? `http://localhost:64346/api/shape/${element.id}/false` : `/api/shape/${element.id}/false`);

        let pt = this.canvas.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

        shape.setAttributeNS(null, "x", `${pt.x - offset.x}`);
        shape.setAttributeNS(null, "y", `${pt.y - offset.y}`);        

        this.canvas.appendChild(shape);
    }

    centerView = () => this.canvas.setAttribute("viewbox", `0 0 ${this.initialWidth} ${this.initialHeight}`);    

    saveScheme(scheme) {
        debugger;
        scheme.plan = this.canvas.outerHTML;

        this.schemeService
            .update(scheme)
            .subscribe(_ => {},
                    error => this.logger.error(error));
    }    

    onResize() {
        this.canvasbox.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.canvasbox.offsetTop}px`;
    }
}