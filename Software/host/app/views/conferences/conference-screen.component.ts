import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { SchemeService } from "../schemes/scheme.service";
import { SchemeModel } from '../../models';

@Component({
    encapsulation: ViewEncapsulation.None,
    host: { '(window:resize)': "onResize($event)" },
    styles: [".h40 { height: 40px }"],
    templateUrl: 'conference-screen.component.html'
})
export class ConferenceScreenComponent implements AfterViewInit {

    canvas: any;
    canvasBox: any;

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
        private schemeService: SchemeService) { }

    ngOnInit() {

        this.canvasBox = this.canvasBoxElRef.nativeElement;

        this.route.params

            .switchMap((params: Params) => {
                // (+) converts string 'id' to a number
              
                let key = params.hasOwnProperty("id") ? +params["id"] : undefined;
                return key ? this.schemeService.get(key) : Observable.empty();
            })
            .subscribe((scheme: SchemeModel) => {
                
                this.canvasBox.insertAdjacentHTML("beforeend", scheme.plan);

                // размеры в см
                let initialHeight = scheme.height * 100,
                    initialWidth = scheme.width * 100;

                this.canvas = this.canvasBox.querySelector("svg");

                if (this.canvas != null) {
                    this.canvas.setAttribute("viewBox", `0 0 ${initialWidth} ${initialHeight}`);
                    this.canvas.style.height = this.canvas.style.width = "100%";
                }
            });
        
    }

    ngAfterViewInit() {
        this.onResize();
    }

    onResize() {
        debugger;
        this.canvasBox.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.headerElRef.nativeElement.offsetHeight - this.footerElRef.nativeElement.offsetHeight}px`;
    }
}