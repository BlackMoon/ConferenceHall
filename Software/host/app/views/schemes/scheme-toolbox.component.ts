import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Mediator } from "../../common/mediator";
import { GroupModel } from '../../models';
import { MenuItem } from 'primeng/primeng';

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
    gridButtonsVisible = false;

    items: MenuItem[];

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
                this.gridButtonsVisible = true;
            });

        this.items = [
            { label: 'New', icon: 'fa-plus' },
            { label: 'Open', icon: 'fa-download' }
        ];
    }

    ngAfterViewInit() {
        this.onResize();
    }

    backButtonClick() {
        this.router.navigate(["groups"], { relativeTo: this.route });
        this.filter = this.header = null;
        this.gridButtonsVisible = false;
    }

    toggleGridView(smallGrid) {
        this.mediator.send("elementList_viewChanged", smallGrid);    
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
            this.gridButtonsVisible = true;
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