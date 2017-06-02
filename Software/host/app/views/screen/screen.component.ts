import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { borderClass, markClass } from "../../common/svg-utils";
import { MemberModel, ScreenModel, TimeRange } from '../../models';
import { ScreenService } from "./screen.service";

const tickInterval = 5000;

@Component({
    encapsulation: ViewEncapsulation.None,
    host: { '(window:resize)': "onResize($event)" },
    styles: [".h40 { height: 40px }"],
    templateUrl: 'screen.component.html'
})
export class ScreenComponent implements OnInit {

    canvas: any;
    canvasBox: any;

    initialHeight: number;
    initialWidth: number;
    members: MemberModel[];

    now: Date = new Date();
    endDate: Date;
    startDate: Date;
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
     * id конференции
     */
    id: number;
    
    activeScreen: ScreenModel;

    /**
     * (Бегущая) строка
     */
    ticker: string;

    @ViewChild('canvasbox') canvasBoxElRef: ElementRef;

    @ViewChild('header') headerElRef: ElementRef;

    @ViewChild('footer') footerElRef: ElementRef;

    @ViewChild('wrapper') wrapperElRef: ElementRef;

    constructor(
        private logger: Logger,
        private route: ActivatedRoute,
        private screenService: ScreenService) {
    }

    ngOnInit() {
        
        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;

                if (key) {
                    // служба signalR может отсутствовать
                    this.screenService
                        .start(key)
                        .flatMap(_ => this.screenService.sendTickers)
                        .subscribe(tickers => this.tickers = tickers);

                    return this.screenService.get(key);
                }

                return Observable.empty();
            })
            .subscribe((screen: ScreenModel) => {

                this.activeScreen = screen;
                this.tickers = this.activeScreen.tickers || [];
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

        this.onResize();
    }
    
    onResize() {
        this.canvasBoxElRef.nativeElement.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.headerElRef.nativeElement.offsetHeight - this.footerElRef.nativeElement.offsetHeight}px`;
    }
}