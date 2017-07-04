import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { borderClass, markClass } from "../../common/svg-utils";
import { MemberModel, MemberState, ScreenModel } from '../../models';
import { SchemeMainComponent } from "../schemes/scheme-main.component";
import { HubService } from "../../common/hub-service";
import { ScreenService } from "./screen.service";
import { MemberScreenComponent } from "./member-screen.component";

const tickInterval = 5000;

@Component({
    host: { '(window:resize)': "onResize($event)" },
    styleUrls: ["screen.component.css"],
    templateUrl: 'screen.component.html'
})
export class ScreenComponent implements OnInit {

    canvas: any;
    canvasBox: any;

    now: Date = new Date();
    endDate: Date;
    startDate: Date;
    subject: string;

    hubObservable: Observable<any>;

// ReSharper disable once InconsistentNaming
    private _tickers: string[] = [];

    get tickers(): string[] {
        return this._tickers;
    }

    set tickers(tickers: string[]) {
        
        this.ticker = (tickers.length > 0) ? tickers[0] : "";
        this._tickers = tickers;
    }    
    
    activeScreen: ScreenModel;

    /**
     * (Бегущая) строка
     */
    ticker: string;

    @ViewChild('box1') box1ElRef: ElementRef;
    @ViewChild('box2') box2ElRef: ElementRef;

    @ViewChild('header') headerElRef: ElementRef;

    @ViewChild('footer') footerElRef: ElementRef;

    @ViewChild('wrapper') wrapperElRef: ElementRef;

    @ViewChild(MemberScreenComponent) memberScreen: MemberScreenComponent;

    @ViewChild(SchemeMainComponent) schemeMain: SchemeMainComponent;

    constructor(
        private logger: Logger,
        private route: ActivatedRoute,
        private hubService: HubService,
        private screenService: ScreenService) {
    }   

    ngOnInit() {
        
        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;

                if (key) {

                    this.memberScreen.conferenceId = key;

                    // служба signalR может отсутствовать
                    this.hubService
                        .start(key)
                        .subscribe(_ => {

                            this.hubService
                                .confirmMember
                                .subscribe(member => {
                                  
                                    if (member.seat !== member.oldSeat)
                                        this.schemeMain.toggleMark(member.oldSeat, false);

                                    this.schemeMain.toggleMark(member.seat, member.state === MemberState.Confirmed);
                                    
                                    this.memberScreen.confirmMember(member);
                                });

                            this.hubService
                                .unregisterMember
                                .subscribe(id => {

                                    let member = this.memberScreen.getMember(id);
                                    if (member) {
                                        this.schemeMain.toggleMark(member.seat, false);   
                                        this.memberScreen.removeMember(member.id);
                                    }
                                });

                            this.hubService
                                .sendTickers
                                .subscribe(tickers => this.tickers = tickers);
                        });

                    return this.screenService.get(key);
                }

                return Observable.empty();
            })
            .subscribe((screen: ScreenModel) =>
                {
                    this.activeScreen = screen;
                    this.tickers = this.activeScreen.tickers || [];
                },
                error => this.logger.error2(error));

        Observable
            .combineLatest(this.schemeMain.schemeLoaded, this.memberScreen.membersLoaded)
            .subscribe((a: Array<any>) => {
                // занятые места
                let members: MemberModel[] = a[1] || [];
                [].forEach.call(members, m => (m.state === MemberState.Confirmed) && this.schemeMain.toggleMark(m.seat));
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

            this.memberScreen.scroll();

        }, tickInterval);

        this.onResize();
    }

    ngAfterViewInit() {
        this.onResize();
    }

    onResize() {
       
        let h = this.wrapperElRef.nativeElement.offsetHeight;

        let cs = getComputedStyle(this.headerElRef.nativeElement);
        h -= this.headerElRef.nativeElement.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);

        cs = getComputedStyle(this.footerElRef.nativeElement);
        h -= this.footerElRef.nativeElement.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);

        this.box1ElRef.nativeElement.style.height = this.box2ElRef.nativeElement.style.height = `${h}px`;
    }
}