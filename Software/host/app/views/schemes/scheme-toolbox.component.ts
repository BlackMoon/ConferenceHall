import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Mediator } from "../../common/mediator";
import { GroupModel } from '../../models';

/**
 * min кол-во символов фильтра
 */
const minChars = 3;

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'scheme-toolbox',
    templateUrl: 'scheme-toolbox.component.html'
})
export class SchemeToolboxComponent implements AfterViewInit {

    filter: string;
    header: string;

    @ViewChild('content') contentElRef: ElementRef;
    @ViewChild('wrapper') wrapperElRef: ElementRef;

    constructor(
        private mediator: Mediator,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router) {
        
        mediator.notify("groupList_itemClicked")
            .subscribe(g => {

                this.router.navigate(["elements"], { queryParams: { groupid: g.id }, relativeTo: this.route });
                this.filter = null;
                this.header = g.name;
            });
    }

    ngAfterViewInit() {
        this.onResize();
    }

    backButtonClick() {
        this.router.navigate(["groups"], { relativeTo: this.route });
        this.filter = this.header = null;
    }

    /**
     * Handle input text value change
     * @param value
     */
    filterChange(value) {

        this.filter = value;

        if (value.length >= minChars) {

            this.router.navigate(["elements"], { queryParams: { filter: value }, relativeTo: this.route });
            this.header = value;
        }
    }

    /**
     * Handle enter key press
     */
    filterKeyPressed(event) {
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    onResize() {
        this.contentElRef.nativeElement.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.contentElRef.nativeElement.offsetTop - 6}px`;
    }
}