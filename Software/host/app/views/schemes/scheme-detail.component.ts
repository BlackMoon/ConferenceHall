import { Component, OnInit } from '@angular/core';
import { ButtonItem, ElementGroupModel } from '../../models';

/**
 * Операции 
 */
enum Operation { Group, Filter, FilterS, New };

@Component({
    templateUrl: `scheme-detail.component.html`
})
export class SchemeDetailComponent {
    
    group: ElementGroupModel = <any>{ code: null };

// ReSharper disable once InconsistentNaming
    private Operation = Operation;
    operation: Operation = Operation.Group;

    smallGridView: boolean = false;

    /**
     * Кнопки навигации
     */
    navButtons:[ButtonItem] = [
        { id: 'itemHome', icon: 'fa-home', click: () => this.homeBtnClick() },
        { id: 'itemBack', icon: 'fa-undo', click: () => this.backBtnClick() },
        { id: 'itemGrid', icon: 'fa-th-large', visible: false, click: () => this.smallGridView = false },
        { id: 'itemGridS', icon: 'fa-th', visible: false, click: () => this.smallGridView = true }
    ];

    /**
     * История навигации по группам 
     */
    prevGroupCodes: string[] = [];

    get visibleNavButtons() {
        return this.navButtons.filter(b => !b.hasOwnProperty('visible') || b.visible);
    }

    navToolbarClick = (bi: ButtonItem, event) => bi.click && bi.click.call(bi, event);

    elementGroupClicked = (group: ElementGroupModel) => {

        this.prevGroupCodes.push(this.group.code);
        this.group = group;
        
        switch (group.code) {

            case 'add':
                this.operation = Operation.New;
                break;

            default:
                this.operation = Operation.Filter;
                break;
        }
        
    };

    backBtnClick = () => {

        this.group.code = this.prevGroupCodes.pop();
        this.operation = Operation.Group;
    };

    homeBtnClick = () => {
        this.group.code = null;
        this.prevGroupCodes = [];
        this.operation = Operation.Group;
    };
}