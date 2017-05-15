import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";

import Point from "../../common/point";
import * as SVG from "../../common/svg-utils";

import { DragOffset, DragType, ElementModel, SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

const zoomStep = 0.1;

@Component({
    host: { '(window:resize)': "onResize($event)" },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit, OnDestroy, OnInit {

    canvas: any;
    canvasBox: any;

    clickPoint: Point;                              // захват точки canvas'a (для смещения)

    gridInterval: number;
    initialHeight: number;
    initialWidth: number;

// ReSharper disable once InconsistentNaming
    private _svgElement: any = null;                // selected svgElement

    get svgElement() {
        return this._svgElement;
    }
    set svgElement(shape: any) {
        
        // снять все ранее выделенные объекты
        let frames = this.canvas.querySelectorAll(`.${SVG.frameClass}`);
        [].forEach.call(frames,
            frame => frame.setAttributeNS(null, "visibility", "hidden"));

        if (!!shape) {

            this.router
                .navigate(['shape'], { relativeTo: this.route })
                .then(_ => this.mediator.broadcast("schemeMain_shapeSelected", shape));

            // выделить
            let frame = shape.querySelector(`.${SVG.frameClass}`);
            if (frame != null)
                frame.setAttributeNS(null, "visibility", "visible");
        }
        else 
            this.router.navigate(["groups"], { relativeTo: this.route });
        

        this._svgElement = shape;
    }

    svgElementOffset: Point;                        // mouse offset внутри svgElement'a
    svgOrigin: Point;                               // viewBox origin (для смещения)

    zoomCoef: number;                               // коэф. масштабирования [0..1]

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
        private mediator: Mediator,
        private route: ActivatedRoute,
        private router: Router,
        private schemeService: SchemeService) {

        this.intervals = [
            { label: "Нет", value: 0 },
            { label: "1", value: 1 },
            { label: "0.5", value: 0.5 },
            { label: "0.25", value: 0.25 },
            { label: "0.1", value: 0.1 }
        ];
    }

    get cloneButtonDisabled(): boolean {
        return (this.removeButtonDisabled || !this.svgElement.classList.contains(SVG.shapeClass));
    }

    get removeButtonDisabled(): boolean {
        return (this.svgElement == null);
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

                        let shapes = this.canvas.querySelectorAll(`g.${SVG.markClass}, g.${SVG.shapeClass}`);
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

        let g = document.createElementNS(this.canvas.namespaceURI, "g");
        g.addEventListener("mousedown", (event) => this.shapeMouseDown(event));

        g.setAttribute("class", SVG.markClass);
        g.setAttributeNS(null, "transform", "translate(100, 100)");

        // размеры в см
        let circle = document.createElementNS(this.canvas.namespaceURI, "ellipse");
        
        circle.setAttributeNS(null, "rx", "30");
        circle.setAttributeNS(null, "ry", "30");

        circle.setAttributeNS(null, "fill", "rgba(0, 115, 234, 0.9)");
        g.appendChild(circle);

        let text = document.createElementNS(this.canvas.namespaceURI, "text"),
            id = this.canvas.querySelectorAll(`g.${SVG.markClass}`).length + 1;

        text.setAttribute("class", `_${id}`);
        text.textContent = id;

        text.setAttributeNS(null, "alignment-baseline", "middle");
        text.setAttributeNS(null, "text-anchor", "middle");
        
        g.appendChild(text);

        this.canvas.appendChild(g);

        this.svgElement = g;
    }

    canvasMouseDown(event) {

        if (event.buttons === 1) {
            this.clickPoint = new Point(event.clientX, event.clientY);
            this.svgElement = null;
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

                if (this.svgElement.classList.contains(SVG.shapeClass)) {
                    pt.x -= this.svgElementOffset.x;
                    pt.y -= this.svgElementOffset.y;
                }
                
                pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

                let attr = [];
                for (let t of this.svgElement.transform.baseVal) {

                    let m: SVGMatrix = t.matrix;

                    switch (t.type) {
                        
                        case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                            attr.push(`translate(${pt.x} ${pt.y})`);
                            break;
                            
                        case SVGTransform.SVG_TRANSFORM_ROTATE:

                            let box = this.svgElement.getBBox();
                            attr.push(`rotate(${t.angle} ${box.width / 2} ${box.height / 2})`);

                            break;
                        
                    }
                }

                this.svgElement.setAttributeNS(null, "transform", attr.join(","));
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

            if (this.svgElement !== null && this.svgElement.classList.contains(SVG.shapeClass)) {
                
                let attr = [],
                    x = 0, y = 0; 
                    
                for (let t of this.svgElement.transform.baseVal) {

                    let m: SVGMatrix = t.matrix;

                    switch (t.type) {
                            
                        case SVGTransform.SVG_TRANSFORM_TRANSLATE:

                            x = m.e;
                            y = m.f;

                            if (this.gridInterval > 0) {
                                let int = this.gridInterval * 100;              // размеры в см

                                x = Math.floor(x / int) * int;
                                y = Math.floor(y / int) * int;
                            }
                            attr.push(`translate(${x} ${y})`);

                            break;
                            
                        case SVGTransform.SVG_TRANSFORM_SCALE:

                            attr.push(`scale(${m.a}, ${m.d})`);
                            break;
                            
                        case SVGTransform.SVG_TRANSFORM_ROTATE:
                            let box = this.svgElement.getBBox();
                            attr.push(`rotate(${t.angle} ${box.width / 2} ${box.height / 2})`);
                            break;
                            
                        default:
                            attr.push(`matrix(${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.e}, ${m.f})`);
                            break;
                    }
                }
                    
                this.svgElement.setAttributeNS(null, "transform", attr.join(","));
            }
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

        rect.setAttribute("class", SVG.borderClass);

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
                line.setAttribute("class", SVG.lineClass);

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
                line.setAttribute("class", SVG.lineClass);

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
            offset: Point = JSON.parse(event.dataTransfer.getData(DragOffset)),
            // размеры в см
            h = element.height * 100,
            w = element.width * 100;

        let g = document.createElementNS(this.canvas.namespaceURI, "g");
        g.addEventListener("mousedown", (event) => this.shapeMouseDown(event));

        g.setAttribute("class", SVG.shapeClass);

        let pt = this.canvas.createSVGPoint();
        pt.x = event.clientX - offset.x;
        pt.y = event.clientY - offset.y;

        pt = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

        if (this.gridInterval > 0) {
            let int = this.gridInterval * 100; // размеры в см

            pt.x = Math.floor(pt.x / int) * int;
            pt.y = Math.floor(pt.y / int) * int;
        }

        g.setAttributeNS(null, "transform", `translate(${pt.x}, ${pt.y})`);

        let image = document.createElementNS(this.canvas.namespaceURI, "image");
        // размеры в см
        image.setAttributeNS(null, "height", `${h}`);
        image.setAttributeNS(null, "width", `${w}`);
        image.setAttributeNS("http://www.w3.org/1999/xlink", "href", `/api/shape/${element.id}/false`);

        g.appendChild(image);

        let rect = document.createElementNS(this.canvas.namespaceURI, "rect");
        rect.setAttribute("class", SVG.frameClass);

        rect.setAttributeNS(null, "height", `${h}`);
        rect.setAttributeNS(null, "width", `${w}`);

        rect.setAttributeNS(null, "fill", "none");
        rect.setAttributeNS(null, "stroke", "blue");
        rect.setAttributeNS(null, "stroke-width", "1");

        g.appendChild(rect);
        
        // вставка перед метками
        let firstMark = this.canvas.querySelector(`g.${SVG.markClass}`);
        this.canvas.insertBefore(g, firstMark);

        this.svgElement = g;
    }

    intervalChange = _ => {
        // удалить старую сетку
        let lines = this.canvas.querySelectorAll(`line.${SVG.lineClass}`);
        [].forEach.call(lines, (line) => this.canvas.removeChild(line));

        this.drawGrid();
    };

    saveScheme(scheme) {

        let svg = this.canvas.cloneNode(true);

        // сохраняется начальный план (без трансформации)
        while (svg.attributes.length > 0)
            svg.removeAttribute(svg.attributes[0].name);

        svg.setAttribute("viewbox", `0 0 ${this.initialWidth} ${this.initialHeight}`);

        // сетку и границу не нужно сохранять
        let lines = svg.querySelectorAll(`line.${SVG.lineClass}`);
        [].forEach.call(lines, (line) => svg.removeChild(line));

        let box = svg.querySelector(`rect.${SVG.borderClass}`);
        svg.removeChild(box);
        
        // снять все ранее выделенные объекты
        let frames = svg.querySelectorAll(`.${SVG.frameClass}`);
        [].forEach.call(frames,
            frame => frame.setAttributeNS(null, "visibility", "hidden"));
        
        scheme.gridInterval = this.gridInterval;
        scheme.plan = svg.outerHTML;

        this.schemeService
            .update(scheme)
            .subscribe(_ => { },
            error => this.logger.error(error));
    }

    /**
     * Клонировать элемент схемы
     */
    shapeClone() {
        let clone = this.svgElement.cloneNode(true),
            matrix: SVGMatrix = this.svgElement.transform.baseVal.getItem(0).matrix,
            // размеры в см
            offset = 50;

        clone.addEventListener("mousedown", (event) => this.shapeMouseDown(event));

        clone.setAttributeNS(null,
            "transform",
            `translate(${matrix.e + offset}, ${matrix.f  + offset})`);

        // вставка перед метками
        let firstMark = this.canvas.querySelector(`g.${SVG.markClass}`);
        this.canvas.insertBefore(clone, firstMark);

        this.svgElement = clone;
    }

    shapeMouseDown(event) {
        
        event.stopPropagation();

        if (event.button === 0) {
            
            this.svgElement = event.currentTarget;

            // на передний план --> вставка перед метками
            let firstMark = this.canvas.querySelector(`g.${SVG.markClass}`);
            this.canvas.insertBefore(this.svgElement, firstMark);

            let cr: ClientRect = this.svgElement.getBoundingClientRect();
            this.svgElementOffset = new Point(event.clientX - cr.left, event.clientY - cr.top);            
        }
    }

    shapeRemove() {
        this.canvas.removeChild(this.svgElement);
        this.svgElement = null;
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