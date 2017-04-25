import { Component, ViewChild } from '@angular/core';
import { ButtonItem, ElementGroupModel } from '../../models';
import { AutoComplete } from 'primeng/components/autocomplete/autocomplete';

/**
 * min кол-во символов фильтра
 */
const minChars = 3;

/**
 * Операции 
 */
enum Operation { Group, Filter, New };

@Component({
    templateUrl: `scheme-detail.component.html`
})
export class SchemeDetailComponent {

    @ViewChild('autoFilter') autoFilter: AutoComplete;

    set filter(filter: string) {
        (filter.length >= minChars) && (this.operation = Operation.Filter);
    }

    group: ElementGroupModel = <any>{};
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
    prevGroups: ElementGroupModel[] = [];

    get visibleNavButtons() {
        return this.navButtons.filter(b => !b.hasOwnProperty('visible') || b.visible);
    }

    navToolbarClick = (bi: ButtonItem, event) => bi.click && bi.click.call(bi, event);

    elementGroupClicked = (group: ElementGroupModel) => {

        this.prevGroups.push(this.group);
        
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
        
        this.group = this.prevGroups.pop();

        this.autoFilter.writeValue(null);
        this.operation = Operation.Group;
        this.toggleGridButtons();
    };

    homeBtnClick = () => {
        this.group = <any>{};
        this.prevGroups = [];
        
        this.autoFilter.writeValue(null);
        this.operation = Operation.Group;
        this.toggleGridButtons();
    };

    toggleGridButtons = () =>
        this.navButtons
            .filter(b => b.id === 'itemGrid' || b.id === 'itemSmallGrid')
            .forEach(b => b.visible = this.operation === Operation.Filter);
    
}