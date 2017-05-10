import { isDevMode, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import Point from "../../common/point";

import { DragOffset, DragType, ElementModel, SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

const borderClass = "box";
const lineClass = "grid";

enum SvgOperation { CanvasMove, ShapeMove };

@Component({
    host: { '(window:resize)': "onResize($event)" },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit, OnDestroy, OnInit {

    canvas: any;
    canvasBox: any;

    clickPoint: Point; // захват точки canvas'a (для смещения)

    gridInterval: number;
    initialHeight: number;
    initialWidth: number;

    svgElement: any = null; // selected svgElement
    svgElementOffset: Point; // mouse offset внутри svgElement'a
    svgOrigin: Point; // viewBox origin (для смещения)

    schemeForm: FormGroup;
    schemeFormVisible: boolean;
    intervals: SelectItem[];

    @Input()
    schemeid: number;

    @ViewChild('canvas')
    canvasElRef: ElementRef;

    @ViewChild('canvasBox')
    canvasBoxElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private schemeService: SchemeService) {

        this.intervals = [
            { label: "Нет", value: 0 },
            { label: "1", value: 1 },
            { label: "0.5", value: 0.5 },
            { label: "0.25", value: 0.25 }
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

        this.canvasBox = this.canvasBoxElRef.nativeElement;

        this.schemeService
            .get(this.schemeid)
            .subscribe((scheme: SchemeModel) => {

                    this.canvasBox.insertAdjacentHTML("beforeend", scheme.plan);
                    this.gridInterval = scheme.gridInterval;
                    // размеры в см
                    this.initialHeight = scheme.height * 100;
                    this.initialWidth = scheme.width * 100;

                    this.canvas = this.canvasBox.querySelector("svg");

                    if (this.canvas != null) {
                        this.canvas.style.height = this.canvas.style.width = "100%";

                        this.centerView();
                        this.drawBorder();
                        this.drawGrid();

                        this.canvas
                            .addEventListener("mousedown", (event) => this.canvasMouseDown(event));

                        this.canvas
                            .addEventListener("mousemove", (event) => this.canvasMouseMove(event));

                        this.canvas
                            .addEventListener("mouseup", (event) => this.canvasMouseUp(event));

                        let shapes = this.canvas.querySelectorAll("image");
                        [].forEach.call(shapes,
                            shape => shape.addEventListener("mousedown", (event) => this.shapeMouseDown(event)));

                    }

                    this.schemeForm.patchValue(scheme);
                },
                error => this.logger.error(error));
    }

    ngOnDestroy() {
        this.canvas.removeEventListener("mousemove");
        this.canvas.removeEventListener("mouseup");
    }

    canvasMouseDown(event) {
        if (event.which === 1) {
            this.clickPoint = new Point(event.clientX, event.clientY);
            this.svgOrigin = new Point(this.canvas.viewBox.baseVal.x, this.canvas.viewBox.baseVal.y);
        }
    }

    canvasMouseMove(event) {

        event.preventDefault();

        if (event.which === 1) {

            let pt: SVGPoint = this.canvas.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;

            // перемещение shape
            if (this.svgElement !== null) {

                pt.x -= this.svgElementOffset.x;
                pt.y -= this.svgElementOffset.y;
                pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

                this.svgElement.setAttributeNS(null, "x", pt.x);
                this.svgElement.setAttributeNS(null, "y", pt.y);
            }
            // перемещение canvas'a
            else {
                
                pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

                let clickPt = this.canvas.createSVGPoint();
                clickPt.x = this.clickPoint.x;
                clickPt.y = this.clickPoint.y;
                // трансформация здесь --> т.к. уже изменился viewbox
                clickPt = clickPt.matrixTransform(this.canvas.getScreenCTM().inverse());

                let viewBox = this.canvas.viewBox.baseVal;
                viewBox.x = this.svgOrigin.x - pt.x + clickPt.x;
                viewBox.y = this.svgOrigin.y - pt.y + clickPt.y;
            }
        }
    }

    canvasMouseUp(event) {

        event.preventDefault();
        // позиционирование по сетке
        if (event.which === 1) {

            if (this.svgElement !== null && this.gridInterval > 0) {

                let box: SVGRect = this.svgElement.getBBox(),
                    int = this.gridInterval * 100; // размеры в см

                this.svgElement.setAttributeNS(null, "x", Math.floor(box.x / int) * int);
                this.svgElement.setAttributeNS(null, "y", Math.floor(box.y / int) * int);
            }

            this.svgElement = null;
        }
    }

    /**
     * Установить схему по центру 
     */
    centerView = () => this.canvas.setAttribute("viewBox", `0 0 ${this.initialWidth} ${this.initialHeight}`);

    /**
     * Рисовать границы viewBox'a
     */
    drawBorder() {
        let rect = document.createElementNS(this.canvas.namespaceURI, "rect");

        rect.setAttribute("class", borderClass);

        rect.setAttributeNS(null, "x", "0");
        rect.setAttributeNS(null, "y", "0");
        rect.setAttributeNS(null, "width", `${this.initialWidth}`);
        rect.setAttributeNS(null, "height", `${this.initialHeight}`);

        rect.setAttributeNS(null, "fill", "none");
        rect.setAttributeNS(null, "stroke", "black");
        rect.setAttributeNS(null, "stroke-width", "1");

        this.canvas.appendChild(rect);
    }

    /**
     * Рисовать сетку с шагом {interval}
     * @param interval
     */
    drawGrid() {

        let i,
            line: HTMLElement,
            int = this.gridInterval * 100, // размеры в см
            viewBox = this.canvas.viewBox.baseVal;

        let style = {
            "stroke": "rgb(0, 0, 0)",
            "stroke-dasharray": "5",
            "stroke-width": "0.5"
        };

        // горизонтальные линии
        for (i = 0; i <= this.initialHeight; i += int) {
            line = document.createElementNS(this.canvas.namespaceURI, "line");
            line.setAttribute("class", lineClass);

            line.setAttributeNS(null, "x1", "0");
            line.setAttributeNS(null, "y1", i);
            line.setAttributeNS(null, "x2", `${viewBox.width}`);
            line.setAttributeNS(null, "y2", i);

            for (let key in style) {
                if (style.hasOwnProperty(key)) {
                    line.setAttributeNS(null, key, style[key]);
                }
            }

            this.canvas.appendChild(line);
        }

        // вертикальные линии
        for (i = 0; i <= this.initialWidth; i += int) {
            line = document.createElementNS(this.canvas.namespaceURI, "line");
            line.setAttribute("class", lineClass);

            line.setAttributeNS(null, "x1", i);
            line.setAttributeNS(null, "y1", "0");
            line.setAttributeNS(null, "x2", i);
            line.setAttributeNS(null, "y2", `${viewBox.height}`);

            for (let key in style) {
                if (style.hasOwnProperty(key)) {
                    line.setAttributeNS(null, key, style[key]);
                }
            }

            this.canvas.appendChild(line);
        }
    }

    drop(event) {

        let element: ElementModel = JSON.parse(event.dataTransfer.getData(DragType)),
            offset: Point = JSON.parse(event.dataTransfer.getData(DragOffset));

        let shape = document.createElementNS(this.canvas.namespaceURI, "image");
        shape.addEventListener("mousedown", (event) => this.shapeMouseDown(event));

        // размеры в см
        shape.setAttributeNS(null, "height", `${element.height * 100}`);
        shape.setAttributeNS(null, "width", `${element.width * 100}`);
        shape.setAttributeNS("http://www.w3.org/1999/xlink", "href", `/api/shape/${element.id}/false`);

        let pt = this.canvas.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

        shape.setAttributeNS(null, "x", `${pt.x - offset.x}`);
        shape.setAttributeNS(null, "y", `${pt.y - offset.y}`);

        this.canvas.appendChild(shape);
    }

    intervalChange = _ => {
        // удалить старую сетку
        let lines = this.canvas.querySelectorAll(`line.${lineClass}`);
        [].forEach.call(lines, (line) => this.canvas.removeChild(line));

        this.drawGrid();
    };

    shapeMouseDown(event) {

        if (event.button === 0) {
            event.stopPropagation();
            this.svgElement = event.currentTarget;

            let cr: ClientRect = this.svgElement.getBoundingClientRect();
            this.svgElementOffset = new Point(event.clientX - cr.left, event.clientY - cr.top);
        }
    }

    saveScheme(scheme) {

        let svg = this.canvas.cloneNode(true);

        // сохраняется начальный план
        while (svg.attributes.length > 0)
            svg.removeAttribute(svg.attributes[0].name);

        // сетку и границу не нужно сохранять
        let lines = svg.querySelectorAll(`line.${lineClass}`);
        [].forEach.call(lines, (line) => svg.removeChild(line));

        let box = svg.querySelector(`rect.${borderClass}`);
        svg.removeChild(box);

        scheme.gridInterval = this.gridInterval;
        scheme.plan = svg.outerHTML;

        this.schemeService
            .update(scheme)
            .subscribe(_ => {},
                error => this.logger.error(error));
    }

    zoomIn() {
        debugger;

        let viewBox = this.canvas.viewBox.baseVal,
            zoomW = viewBox.width * (1 - 0.1),
            zoomH = viewBox.height * (1 - 0.1);
        
        let x = viewBox.width * 0.1,
            y = viewBox.height * 0.1,
            w = zoomW,
            h = zoomH;
        
        this.canvas.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    }

    zoomOut() {

    }

    onResize() {
        this.canvasBox.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.canvasBox.offsetTop}px`;
    }
}