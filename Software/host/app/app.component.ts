import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Layout } from "./common/navigation/layout";
import { Logger } from "./common/logger";

const startViewKey = 'returnUrl';

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'conferenceHall-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit, OnInit {

    msgs: Message[] = [];

    private layout: Layout = Layout.None;
    private Layout = Layout;
    /**
     * Стартовая страница
     */
    private startView: string;

    @ViewChild("bottombar") bottomBarEl: ElementRef;
    @ViewChild("topbar") topBarEl: ElementRef;
    @ViewChild("content") contentEl: ElementRef;

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
            .subscribe((data: any) => this.layout = (data.layout !== undefined) ? data.layout : Layout.ShowHeader);

        this.startView = new URLSearchParams(window.location.search.slice(1)).get(startViewKey);
    }

    ngAfterViewInit() {
        this.onResize();
    }

    ngOnInit() {

        this.logger.msgReсeived.subscribe((msgs: Message[]) => this.msgs = msgs);

        // start page --> navigate
        if (this.startView != undefined)
            this.router.navigateByUrl(this.startView);
    }

    bitTest = (layout: Layout) => this.layout & layout;

    onResize() {
        let h = window.innerHeight;

        this.bottomBarEl && (h -= this.bottomBarEl.nativeElement.offsetHeight);
        this.topBarEl && (h -= this.topBarEl.nativeElement.offsetHeight);

        this.contentEl.nativeElement.style.height = `${h}px`;
    }
}