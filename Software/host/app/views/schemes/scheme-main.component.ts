import { isDevMode, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/primeng'
import { Dropdown } from 'primeng/components/dropdown/dropdown';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import Point from "../../common/point";

import { DragOffset, DragType, ElementModel, SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

const lineClass = "grid";
const shapeClass = "el";

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit, OnDestroy, OnInit {
    
    canvas: any;
    canvasbox: any;    

    gridInterval: number;
    initialHeight: number;
    initialWidth: number;

    svgElement: HTMLElement = null;                // selected svgElement
    svgElementOffset: Point;
    
    schemeForm: FormGroup;
    schemeFormVisible: boolean;
    intervals: SelectItem[];

    @Input()
    schemeid: number;

    @ViewChild('canvas')
    canvasElRef: ElementRef;

    @ViewChild('canvasbox')
    canvasboxElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    @ViewChild('dropDown') dropDown: Dropdown;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private schemeService: SchemeService) {

        this.intervals = [
        
            { label: 'Нет', value: 0 },
            { label: '1', value: 1 },
            { label: '0.5', value: 0.5 },
            { label: '0.25', value: 0.25 }
        ];
    }

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
                this.gridInterval = scheme.gridInterval;
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

                    for (let img of this.canvas.querySelectorAll("image")) {
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

    /**
     * Установить схему по центру
     */
    centerView = () => this.canvas.setAttribute("viewbox", `0 0 ${this.initialWidth} ${this.initialHeight}`);    

    /**
     * Рисовать сетку с шагом {interval}
     * @param interval
     */
    drawGrid(interval:number) {
        debugger;
        let lines = this.canvas.querySelectorAll(`line.${lineClass}`);
        [].forEach.call(lines, (line) => this.canvas.removeChild(line));
        debugger;
        let i, line: HTMLElement,
            int = interval * 100,                // размеры в см
            box = this.canvas.viewBox.baseVal,
            x1 = Math.floor(box.x / int + 1) * int,
            x2 = Math.ceil(box.width / int - 1) * int,
            y1 = Math.floor(box.y / int + 1) * int,
            y2 = Math.ceil(box.height / int - 1) * int;

        let style = {
            "stroke": "rgb(0, 0, 0)",
            "stroke-dasharray": "5, 10",
            "stroke-width": "0.5"
        };
        // горизонтальные линии
        for (i = x1; i <= x2; i += int) {
            line = document.createElementNS(this.canvas.namespaceURI, "line");    
            line.setAttribute("class", lineClass);
            
            line.setAttributeNS(null, "x1", i);
            line.setAttributeNS(null, "y1", box.y);
            line.setAttributeNS(null, "x2", i);
            line.setAttributeNS(null, "y2", box.height);

            for (let key in style) {
                if (style.hasOwnProperty(key)) {
                    line.setAttributeNS(null, key, style[key]);
                }
            }

            this.canvas.appendChild(line);
        }
        // вертикальные линии
        for (i = y1; i <= y2; i += int) {
            line = document.createElementNS(this.canvas.namespaceURI, "line");
            line.setAttribute("class", lineClass);

            line.setAttributeNS(null, "x1", box.x);
            line.setAttributeNS(null, "y1", i);
            line.setAttributeNS(null, "x2", box.width);
            line.setAttributeNS(null, "y2", i);

            for (let key in style) {
                if (style.hasOwnProperty(key)) {
                    line.setAttributeNS(null, key, style[key]);
                }
            }

            this.canvas.appendChild(line);
        }

    }

    intervalChange = (event) => this.drawGrid(event.value);

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

    saveScheme(scheme) {
        debugger;
        scheme.gridInterval = this.dropDown.value;
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