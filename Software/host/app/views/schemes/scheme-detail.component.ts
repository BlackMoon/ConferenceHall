import { Component } from '@angular/core';
import { ButtonItem, ElementGroupModel } from '../../models';

/**
 * Операции 
 */
enum Operation { Group, Filter, New };

@Component({
    templateUrl: `scheme-detail.component.html`
})
export class SchemeDetailComponent {
    
    filter: string;
    group: ElementGroupModel = <any>{ code: null };
    smallGridView: boolean = false;

// ReSharper disable once InconsistentNaming
    private Operation = Operation;
    operation: Operation = Operation.Group;

    /**
     * Кнопки навигации
     */
    navButtons:[ButtonItem] = [
        { id: 'itemHome', icon: 'fa-home', click: () => this.homeBtnClick() },
        { id: 'itemBack', icon: 'fa-undo', click: () => this.backBtnClick() },
        { id: 'itemGrid', icon: 'fa-th-large', visible: false, click: () => this.smallGridView = false },
        { id: 'itemSmallGrid', icon: 'fa-th', visible: false, click: () => this.smallGridView = true }
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
        
        switch (group.code) {

            case 'add':
                this.operation = Operation.New;
                this.group.name = 'Создать элемент';
                break;

            default:
                this.group = group;
                this.operation = Operation.Filter;
                break;
        }

        this.toggleGridButtons();
        
    };

    backBtnClick = () => {

        this.group.code = this.prevGroupCodes.pop();

        this.filter = null;
        this.operation = Operation.Group;
        this.toggleGridButtons();
    };

    homeBtnClick = () => {
        this.group.code = null;
        this.prevGroupCodes = [];
        debugger;
        this.filter = null;
        this.operation = Operation.Group;
        this.toggleGridButtons();
    };

    toggleGridButtons = () =>
        this.navButtons
            .filter(b => b.id === 'itemGrid' || b.id === 'itemSmallGrid')
            .forEach(b => b.visible = this.operation === Operation.Filter);
    
}