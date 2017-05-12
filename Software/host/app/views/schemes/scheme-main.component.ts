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
const markClass = "mark";
const zoomStep = 0.1;

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

    svgElement: any = null;              // selected svgElement
    svgElementOffset: Point;             // mouse offset внутри svgElement'a
    svgOrigin: Point;                    // viewBox origin (для смещения)

    zoomCoef: number;                    // коэф. масштабирования

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
            { label: "0.25", value: 0.25 },
            { label: "0.1", value: 0.1 }
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
        this.canvas.removeEventListener("mousedown");
        this.canvas.removeEventListener("mousemove");
        this.canvas.removeEventListener("mouseup");
    }

    onResize() {
        this.canvasBox.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.canvasBox.offsetTop}px`;
    }

    /**
     * Добавить метку
     */
    addMark() {

        let group = document.createElementNS(this.canvas.namespaceURI, "g");
        group.setAttribute("class", markClass);

        group.addEventListener("mousedown", (event) => this.shapeMouseDown(event));
        group.setAttributeNS(null, "transform", "translate(100, 100)");

        // размеры в см
        let circle = document.createElementNS(this.canvas.namespaceURI, "circle");
        
        circle.setAttributeNS(null, "r", "30");

        circle.setAttributeNS(null, "fill", "rgba(0, 115, 234, 0.9)");
        group.appendChild(circle);

        let text = document.createElementNS(this.canvas.namespaceURI, "text");
        text.textContent = this.canvas.querySelectorAll(`g.${markClass}`).length + 1;

        text.setAttributeNS(null, "alignment-baseline", "middle");
        text.setAttributeNS(null, "text-anchor", "middle");
        
        group.appendChild(text);

        this.canvas.appendChild(group);    
    }

    canvasMouseDown(event) {

        if (event.buttons === 1) {
            this.clickPoint = new Point(event.clientX, event.clientY);
            this.svgOrigin = new Point(this.canvas.viewBox.baseVal.x, this.canvas.viewBox.baseVal.y);
        }
    }

    canvasMouseMove(event) {

        event.preventDefault();
        
        if (event.buttons === 1) {

            let pt: SVGPoint = this.canvas.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;

            // перемещение shape
            if (this.svgElement !== null) {

                if (this.svgElement.classList.contains(markClass)) {
                    pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
                    this.svgElement.setAttributeNS(null, "transform", `translate(${pt.x}, ${pt.y})`);
                }
                else
                {

                    pt.x -= this.svgElementOffset.x;
                    pt.y -= this.svgElementOffset.y;
                    pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

                    this.svgElement.setAttributeNS(null, "x", pt.x);
                    this.svgElement.setAttributeNS(null, "y", pt.y);
                }
            }
            // перемещение canvas'a
            else {
                
                pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

                let clickPt = this.canvas.createSVGPoint();
                clickPt.x = this.clickPoint.x;
                clickPt.y = this.clickPoint.y;
                // трансформация здесь --> т.к. уже изменился viewbox
                clickPt = clickPt.matrixTransform(this.canvas.getScreenCTM().inverse());

                let vbox = this.canvas.viewBox.baseVal;
                this.canvas.setAttribute("viewBox", `${this.svgOrigin.x - pt.x + clickPt.x} ${this.svgOrigin.y - pt.y + clickPt.y} ${vbox.width} ${vbox.height}`);
            }
        }
    }

    canvasMouseUp(event) {
        
        event.preventDefault();
        // позиционирование по сетке
        if (event.which === 1) {

            if (this.svgElement !== null && this.gridInterval > 0)
            {
                let box: SVGRect = this.svgElement.getBBox(),
                    int = this.gridInterval * 100; // размеры в см

                if (this.svgElement.nodeName === "image") {
                    this.svgElement.setAttributeNS(null, "x", Math.floor(box.x / int) * int);
                    this.svgElement.setAttributeNS(null, "y", Math.floor(box.y / int) * int);
                }
            }
            this.svgElement = null;
        }
    }

    /**
     * Установить схему по центру 
     */
    centerView = () => {
        this.canvas.setAttribute("viewBox", `0 0 ${this.initialWidth} ${this.initialHeight}`);
        this.zoomCoef = 1;
    };

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
        
        this.canvas.insertBefore(rect, this.canvas.firstChild);
    }

    /**
     * Рисовать сетку с шагом {interval}
     * @param interval
     */
    drawGrid() {

        if (this.gridInterval > 0) {

            let i,
                line: HTMLElement,
                int = this.gridInterval * 100; // размеры в см

            let style = {
                "stroke": "rgb(0, 0, 0)",
                "stroke-width": "0.25"
            };

            // горизонтальные линии
            for (i = 0; i <= this.initialHeight; i += int) {
                line = document.createElementNS(this.canvas.namespaceURI, "line");
                line.setAttribute("class", lineClass);

                line.setAttributeNS(null, "x1", "0");
                line.setAttributeNS(null, "y1", i);
                line.setAttributeNS(null, "x2", `${this.initialWidth}`);
                line.setAttributeNS(null, "y2", i);

                for (let key in style) {
                    if (style.hasOwnProperty(key)) {
                        line.setAttributeNS(null, key, style[key]);
                    }
                }

                this.canvas.insertBefore(line, this.canvas.firstChild);
            }

            // вертикальные линии
            for (i = 0; i <= this.initialWidth; i += int) {
                line = document.createElementNS(this.canvas.namespaceURI, "line");
                line.setAttribute("class", lineClass);

                line.setAttributeNS(null, "x1", i);
                line.setAttributeNS(null, "y1", "0");
                line.setAttributeNS(null, "x2", i);
                line.setAttributeNS(null, "y2", `${this.initialHeight}`);

                for (let key in style) {
                    if (style.hasOwnProperty(key)) {
                        line.setAttributeNS(null, key, style[key]);
                    }
                }
                
                this.canvas.insertBefore(line, this.canvas.firstChild);
            }
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

        pt.x -= offset.x;
        pt.y -= offset.y;
        
        if (this.gridInterval > 0) {
            let int = this.gridInterval * 100; // размеры в см

            pt.x = Math.floor(pt.x / int) * int;
            pt.y = Math.floor(pt.y / int) * int;    
        }

        shape.setAttributeNS(null, "x", pt.x);
        shape.setAttributeNS(null, "y", pt.y);
        
        // вставка перед метками
        let firstMark = this.canvas.querySelector(`g.${markClass}`);
        this.canvas.insertBefore(shape, firstMark);
    }

    intervalChange = _ => {
        // удалить старую сетку
        let lines = this.canvas.querySelectorAll(`line.${lineClass}`);
        [].forEach.call(lines, (line) => this.canvas.removeChild(line));

        this.drawGrid();
    };

    shapeMouseDown(event) {
        
        event.stopPropagation();

        if (event.button === 0) {
            
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

        svg.setAttribute("viewbox", `0 0 ${this.initialWidth} ${this.initialHeight}`);
        scheme.gridInterval = this.gridInterval;
        scheme.plan = svg.outerHTML;

        this.schemeService
            .update(scheme)
            .subscribe(_ => {},
                error => this.logger.error(error));
    }

    /**
     * Масштабирование
     * @param enlarge - увеличение/уменьшение
     */
    zoom(enlarge:boolean = true) {

        let x = this.canvas.viewBox.baseVal.x,
            y = this.canvas.viewBox.baseVal.y;

        if (enlarge) {
            
            if (this.zoomCoef > 0.1) {
                x += this.initialWidth * zoomStep / 2;
                y += this.initialHeight * zoomStep / 2;
            }

            this.zoomCoef = Math.max(0.1, this.zoomCoef - zoomStep);        // max увеличение в 10 раз!
        }
        else {
            
            if (this.zoomCoef < 1) {
                x -= this.initialWidth * zoomStep / 2;
                y -= this.initialHeight * zoomStep / 2;
            }

            this.zoomCoef = Math.min(1, this.zoomCoef + zoomStep);    
        }

        this.canvas.setAttribute("viewBox", `${x} ${y} ${Math.round(this.initialWidth * this.zoomCoef)} ${Math.round(this.initialHeight * this.zoomCoef)}`);
    }
}