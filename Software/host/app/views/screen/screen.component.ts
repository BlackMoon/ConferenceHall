import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { ScreenModel, TimeRange } from '../../models';
import { ScreenService } from "./screen.service";

import * as SVG from "../../common/svg-utils";

const tickInterval = 5000;

@Component({
    encapsulation: ViewEncapsulation.None,
    host: { '(window:resize)': "onResize($event)" },
    styles: [".h40 { height: 40px }"],
    templateUrl: 'screen.component.html'
})
export class ScreenComponent implements AfterViewInit {

    canvas: any;
    canvasBox: any;

    now: Date = new Date();
    period: TimeRange;
    subject: string;

// ReSharper disable once InconsistentNaming
    private _tickers: string[] = [];

    get tickers(): string[] {
        return this._tickers;
    }

    set tickers(tickers: string[]) {
        
        this.ticker = (tickers.length > 0) ? tickers[0] : "";
        this._tickers = tickers;
    }
    /**
     * (Бегущая) строка
     */
    ticker: string;

    initialHeight: number;
    initialWidth: number;

    @ViewChild('canvasBox')
    canvasBoxElRef: ElementRef;

    @ViewChild('header')
    headerElRef: ElementRef;

    @ViewChild('footer')
    footerElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    constructor(
        private logger: Logger,
        private route: ActivatedRoute,
        private screenService: ScreenService) { }

    ngOnInit() {

        this.screenService
            .sendTickers
            .subscribe(tickers => this.tickers = tickers);

        this.canvasBox = this.canvasBoxElRef.nativeElement;

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? Observable.forkJoin(this.screenService.start(key), this.screenService.get(key)) : Observable.empty();
            })
            .subscribe((res:Array<any>) => {
                
                let screen: ScreenModel = res[1];

                this.period = screen.period;
                this.subject = screen.subject;
                this.tickers = screen.tickers || [];

                this.canvasBox.insertAdjacentHTML("beforeend", screen.plan);

                // размеры в см
                this.initialHeight = screen.height * 100,
                this.initialWidth = screen.width * 100;

                this.canvas = this.canvasBox.querySelector("svg");

                if (this.canvas != null) {

                    this.drawBorder();
                    this.centerView();
                    this.canvas.style.height = this.canvas.style.width = "100%";
                }
            });

        // clock
        setInterval(() => this.now = new Date(), 1000);

        // ticker
        setInterval(() => {
            let ix = this.tickers.indexOf(this.ticker) + 1;
            if (ix > this.tickers.length - 1) {
                ix = 0;
            }

            this.ticker = this.tickers[ix];

        }, tickInterval);
    }

    ngAfterViewInit() {
        this.onResize();
    }

    /**
     * Установить схему по центру 
     */
    centerView = () => {
        this.canvas.setAttribute("viewBox", `0 0 ${this.initialWidth} ${this.initialHeight}`);
    };

    /**
     * Рисовать границы viewBox'a
     */
    drawBorder() {
        const rect = document.createElementNS(this.canvas.namespaceURI, "rect");

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

    onResize() {
        this.canvasBox.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.headerElRef.nativeElement.offsetHeight - this.footerElRef.nativeElement.offsetHeight}px`;
    }
}