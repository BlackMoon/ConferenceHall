import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Layout } from "./common/navigation/layout";
import { Logger } from "./common/logger";

const startViewKey = 'returnUrl';

@Component({
    host: {
        '(window:resize)': "onResize($event)"
    },
    selector: 'conferenceHall-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    msgs: Message[] = [];

    private _layout: Layout = Layout.None;
    private Layout = Layout;

    get layout(): Layout {
        return this._layout;
    }

    set layout(value: Layout) {
        this._layout = value;
    }

    private afterSetSubscribe = false;

    @ViewChild('SITE_HEADER')
    headerElRef: ElementRef;

    @ViewChild('SITE_CONTENT')
    contentElRef: ElementRef;

    @ViewChild('SITE_FOOTER')
    footerElRef: ElementRef;

    /**
     * Стартовая страница
     */
    private startView: string;

    constructor(
        private route: ActivatedRoute,
        private logger: Logger,
        private router: Router) {

        this.router
            .events
            .filter(e => e instanceof NavigationEnd)
            .map(() => this.route)
            .map(r => {
                // find the last activated route
                while (r.firstChild) r = r.firstChild;
                return r;
            })
            .mergeMap(r => r.data)
            .subscribe((data: any) => { this.layout = (data.layout !== undefined) ? data.layout : Layout.ShowHeader;});

        this.startView = new URLSearchParams(window.location.search.slice(1)).get(startViewKey);
    }

    ngOnInit() {

        this.logger.msgReсeived.subscribe((msgs: Message[]) => this.msgs = msgs);

        // start page --> navigate
        if (this.startView != undefined)
            this.router.navigateByUrl(this.startView);
    }

    onResize() {
        this.setContentHeight();
    }

    ngAfterViewChecked() {
        this.onResize();
    }

    setContentHeight = function () {

        var winH = window.innerHeight;

        var contentH = this.contentElRef != null ? this.contentElRef.nativeElement.clientHeight : 0;
        var headerH = this.headerElRef != null ? this.headerElRef.nativeElement.clientHeight : 0;
        var footerH = this.footerElRef != null ? this.footerElRef.nativeElement.clientHeight : 0;

        this.contentElRef.nativeElement.style.height = (winH - headerH - footerH) + 'px';

       //alert(winH + "-" + contentH + "+" + headerH + "+" + footerH);
    }

    bitTest = (layout: Layout) => { return this.layout & layout };

}