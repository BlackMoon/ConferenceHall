import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Logger } from "../../common/logger";

import { SchemeModel } from "../../models";
import { SchemeService } from "./scheme.service";

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit, OnInit {

    @Input()
    schemeid:number;

    canvas: any;

    @ViewChild('canvas')
    canvasElRef: ElementRef;

    @ViewChild('canvasbox')
    canvasboxElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    constructor(
        private logger: Logger,
        private schemeService: SchemeService) { }

    ngAfterViewInit() {
        this.onResize();
    }

    ngOnInit() {

        this.canvas = this.canvasElRef.nativeElement;

        this.schemeService
            .get(this.schemeid)
            .subscribe((scheme:SchemeModel) => {

                    this.canvas.setAttribute("viewBox", `0 0 ${scheme.width} ${scheme.height}`);

                    this.canvas.insertAdjacentHTML('afterbegin', scheme.plan);
                },
                error => this.logger.error(error));
    }

    onResize() {
        this.canvasboxElRef.nativeElement.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.canvasboxElRef.nativeElement.offsetTop}px`;
    }
}