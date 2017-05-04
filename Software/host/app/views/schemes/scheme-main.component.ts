import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';


@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'scheme-main',
    templateUrl: 'scheme-main.component.html'
})
export class SchemeMainComponent implements AfterViewInit {

    @ViewChild('canvas')
    canvasElRef: ElementRef;

    @ViewChild('canvasbox')
    canvasboxElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    ngAfterViewInit() {
        this.onResize();
    }

    onResize() {
        this.canvasboxElRef.nativeElement.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.canvasboxElRef.nativeElement.offsetTop}px`;
    }
}