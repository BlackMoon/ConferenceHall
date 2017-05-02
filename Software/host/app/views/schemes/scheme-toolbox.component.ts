import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from "../../common/logger";
import { Mediator } from "../../common/mediator";
import { AddToFavoritesModel, GroupModel, GroupType } from '../../models';
import { MenuItem } from 'primeng/primeng';
import { Menu } from 'primeng/components/menu/menu';

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

    constructor(
        private location: Location,
        private logger: Logger,
        private mediator: Mediator,
        private route: ActivatedRoute,
        private router: Router) {

        mediator.notify("groupList_itemClicked")
            .subscribe((g: GroupModel) => {

                this.router.navigate(["elements"], { queryParams: { gid: g.id }, relativeTo: this.route });
                this.filter = null;
                this.header = g.name;
                this.gridButtonsVisible = true;
                this.groupType = g.groupType;
            });

        mediator.notify("elementList_selectionChanged")
            .subscribe(n => this.selectedElementIds = n);
    }

    ngAfterViewInit() {
        this.onResize();
    }
    
    homeButtonClick(event) {
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
        this.mediator.send("elementList_viewChanged", smallGrid);
    }

    toggleMenu(event) {

        this.menuItems = [];
        
        switch (this.groupType) {
            // изменения только в пользовательской группе
            case GroupType.User:
                
                this.menuItems.push({ label: 'Добавить', icon: 'fa-plus', routerLink: "elements/new" });
                debugger;
                if (this.selectedElementIds.length > 0) {
                    this.menuItems.push({label: "Изменить", icon: 'fa-pencil-square-o', routerLink: `elements/${this.selectedElementIds[0]}`});
                    this.menuItems.push({
                        label: 'Удалить',
                        icon: 'fa-trash',
                        command: () => this.mediator.send("elementList_deleteElements", this.selectedElementIds)
                    });
                    this.menuItems.push({ label: 'В избранное', icon: 'fa-star' });
                }
                break;

            case GroupType.Favorites:

                if (this.selectedElementIds.length > 0) {

                    this.menuItems.push({
                        label: 'Удалить из избранного',
                        icon: 'fa-star',
                        command: () => this.mediator.send<AddToFavoritesModel>("elementList_addToFavorites", { ids: this.selectedElementIds, add: false })
                    });
                }

                break;

            default:

                if (this.selectedElementIds.length > 0) {

                    this.menuItems.push({
                        label: 'В избранное',
                        icon: 'fa-star',
                        command: () => this.mediator.send<AddToFavoritesModel>("elementList_addToFavorites", { ids: this.selectedElementIds, add: true })
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