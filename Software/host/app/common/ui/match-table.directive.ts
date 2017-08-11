import { Component, Directive, ElementRef, AfterViewChecked, Input, HostListener } from '@angular/core';

/**
 * Выставляет высоту .ui-(data|tree)table-tablewrapper в 100% высоты от контейнера
 * Исключает header/footer
 */
@Directive({
    selector: '[matchTable]'
})
export class MatchTableDirective implements AfterViewChecked {

    // table class name to match height (.ui-datatable | .ui-treetable)
    @Input()
    matchTable: string = "";

    @Input()
    overflow: string = "auto";

    table: any;
    wrapper: any;

    constructor(private el: ElementRef) {
    }

    ngAfterViewChecked() {

        const cls = "ui-widget-content";
       
        this.table = this.el.nativeElement.querySelector(`div.${this.matchTable}`);
        
        if (this.table) {
            this.wrapper = this.table.querySelector(`div.${this.matchTable}-tablewrapper`);

            this.wrapper.classList.add(cls);
            this.wrapper.style.overflow = this.overflow;
            this.wrapper.querySelector("table").classList.remove(cls);

            // call our matchHeight function here later
            this.onResize();
        }
    }

    @HostListener('window:resize')
    onResize() {

        if (!this.table) return;
       
        // call our applyHeight function here later
        let header = this.table.querySelector(`div.${this.matchTable}-header`),
            footer = this.table.querySelector(`div.${this.matchTable}-footer`),
            paginator = this.table.querySelector("div.ui-paginator");

        let h = this.table.offsetHeight;
        header && (h -= header.offsetHeight);
        footer && (h -= footer.offsetHeight);
        paginator && (h -= paginator.offsetHeight);

        this.wrapper.style.height = `${h}px`;
    }
}