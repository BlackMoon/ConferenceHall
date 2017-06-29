import { Component, Directive, ElementRef, AfterViewChecked, Input, HostListener } from '@angular/core';

/**
 * Выставляет высоту .ui-treetable-tablewrapper в 100% высоты от контейнера
 */
@Directive({
    selector: '[matchTree]'
})
export class MatchTreeDirective implements AfterViewChecked {
    
    table: any;
    wrapper: any;

    constructor(private el: ElementRef) {
    }

    ngAfterViewChecked() {

        const cls = "ui-widget-content";
       
        this.table = this.el.nativeElement.querySelector(".ui-treetable");
        this.wrapper = this.table.querySelector(".ui-treetable-tablewrapper");

        this.wrapper.classList.add(cls);
        this.wrapper.querySelector("table").classList.remove(cls);

        // call our matchHeight function here later
        this.onResize();
    }

    @HostListener('window:resize')
    onResize() {
        // call our applyHeight function here later
        let header = this.table.querySelector(".ui-treetable-header"),
            footer = this.table.querySelector(".ui-treetable-footer");
       
        let h = this.table.offsetHeight;
        header && (h -= header.offsetHeight);
        footer && (h -= footer.offsetHeight);
       
        this.wrapper.style.height = `${h}px`;
    }
}