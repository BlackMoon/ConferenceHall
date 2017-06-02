import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { ElementGroupCommand, GroupModel, GroupType } from '../../models';
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
export class SchemeToolboxComponent implements AfterViewInit, OnDestroy {

    filter: string;
    header: string;
    groupId: number;
    groupType: GroupType;
    gridButtonsVisible = false;
    selectedElementIds: number[] = [];

    menuItems: MenuItem[];

    @ViewChild('content')
    contentElRef: ElementRef;

    @ViewChild('menuToggler')
    menuTogglerElRef: ElementRef;

    @ViewChild('wrapper')
    wrapperElRef: ElementRef;

    private subscription: Subscription = new Subscription();

    constructor(
        private location: Location,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute,
        private router: Router) {

        this.subscription.add(
            mediator
                .on<GroupModel>("groupList_itemClicked")
                .subscribe(g => {
                    this.router.navigate(["elements"], { queryParams: { gid: g.id }, relativeTo: this.route });
                    this.filter = null;
                    this.header = g.name;
                    this.gridButtonsVisible = true;
                    this.groupId = g.id;
                    this.groupType = g.groupType;
                })
        );

        this.subscription.add(
            mediator
                .on("elementDetail_itemSaved")
                .subscribe(_ => this.homeButtonClick())
        );

        this.subscription.add(
            mediator
                .on<number[]>("elementList_selectionChanged")
                .subscribe(n => this.selectedElementIds = n)
        );

        this.subscription.add(
            mediator
                .on<any>("schemeMain_shapeSelected")
                .subscribe(s => {
                    this.header = s ? s.getAttribute("data-name") : null;
                    this.gridButtonsVisible = false;
                })
        );
    }

    ngAfterViewInit() {
        this.onResize();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    homeButtonClick() {
        this.router.navigate(["groups"], { relativeTo: this.route });
        this.filter = this.header = null;
        this.gridButtonsVisible = false;
        this.groupType = null;
        this.selectedElementIds = [];
    }

    /**
     * Handle input text value change
     * @param value
     */
    filterChange(value) {

        this.filter = value;

        if (value.length >= minChars) {

            this.router.navigate(["elements"], { queryParams: { f: value }, relativeTo: this.route });
            this.header = value;
            this.gridButtonsVisible = true;
            this.groupId = null;
            this.groupType = null;
        }
    }

    /**
     * Handle enter key press
     */
    filterKeyPressed(event) {
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    toggleGridView(smallGrid) {
        this.mediator.broadcast("elementList_viewChanged", smallGrid);
    }

    toggleMenu(event) {

        this.menuItems = [];
        
        switch (this.groupType) {
            // изменения только в пользовательской группе!
            case GroupType.User:
                
                this.menuItems.push({
                    label: 'Добавить',
                    icon: 'fa-plus',
                    command: (event) => {
                        this.header = event.item.label;
                        this.router.navigate(["elements/new"], { relativeTo: this.route });
                    }
                });
               
                if (this.selectedElementIds.length > 0) {

                    this.menuItems.push({
                        label: "Изменить",
                        icon: 'fa-pencil-square-o',
                        command: (event) => {
                            this.header = event.item.label;
                            this.router.navigate([`elements/${this.selectedElementIds[0]}`], { relativeTo: this.route });
                        }
                    });

                    this.menuItems.push({
                        label: 'Удалить',
                        icon: 'fa-trash',
                        command: () => this.mediator.broadcast("elementList_deleteElements", { ids: this.selectedElementIds, groupid: this.groupId})
                    });

                    this.menuItems.push({
                        label: 'В избранное',
                        icon: 'fa-star',
                        command: () => this.mediator.broadcast("elementList_addToFavorites", { ids: this.selectedElementIds, groupid: this.groupId })
                    });
                }
                break;

            case GroupType.Favorites:

                if (this.selectedElementIds.length > 0) {

                    this.menuItems.push({
                        label: 'Удалить из избранного',
                        icon: 'fa-star',
                        command: () => this.mediator.broadcast("elementList_deleteElements", { ids: this.selectedElementIds, groupid: this.groupId })
                    });
                }

                break;

            default:

                if (this.selectedElementIds.length > 0) {

                    this.menuItems.push({
                        label: 'В избранное',
                        icon: 'fa-star',
                        command: () => this.mediator.broadcast("elementList_addToFavorites", { ids: this.selectedElementIds, groupid: this.groupId })
                    });
                }
                break;

        }

        if (this.menuItems.length > 0) {
            this.menuTogglerElRef.nativeElement.click();
            event.stopPropagation();
        }
    }

    onResize() {
        this.contentElRef.nativeElement.style.height = `${this.wrapperElRef.nativeElement.offsetHeight - this.contentElRef.nativeElement.offsetTop - 6}px`;
    }
}