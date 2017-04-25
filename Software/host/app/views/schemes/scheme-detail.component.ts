import { Component, ViewChild } from '@angular/core';
import { ButtonItem, ElementGroupModel } from '../../models';
import { ElementListComponent } from "../elements/element-list.component";

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

    @ViewChild(ElementListComponent) elementList: ElementListComponent;
    
    filter: string;   
    smallGridView: boolean = false;
    title: string;

    set group(group: ElementGroupModel) {
        
        let title = null;
        if (!!group) {
            this.elementList.queryElements(null, group.code);
            title = group.name;
        }
        this.title = title;
    }

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

    elementCreated = () => this.operation = Operation.Group;

    elementGroupClicked = (group: ElementGroupModel) => {

        this.prevGroups.push(this.group);
        
        switch (group.code) {

            case 'add':
                this.operation = Operation.New;
                this.title = 'Создать элемент';
                break;

            default:
                this.group = group;
                this.operation = Operation.Filter;
                break;
        }

        this.toggleGridButtons();
        
    };

    backBtnClick = () => {

        this.filter = null;
        this.group = this.prevGroups.pop();
        this.operation = Operation.Group;
        
        this.toggleGridButtons();
    };

    homeBtnClick = () => {
       
        this.filter = this.group = null;
        this.operation = Operation.Group;
        this.prevGroups = [];
        
        this.toggleGridButtons();
    };

    /**
     * Handle input text value change
     * @param value
     */
    filterChange(value) {

        this.filter = value;

        if (value.length >= minChars) {
            this.operation = Operation.Filter;
            this.elementList.queryElements(value);
            this.title = value;
        }
    }

    /**
     * Handle enter key press
     */
    inputKeyPressed(event) {
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    toggleGridButtons = () =>
        this.navButtons
            .filter(b => b.id === 'itemGrid' || b.id === 'itemSmallGrid')
            .forEach(b => b.visible = this.operation === Operation.Filter);
    
}