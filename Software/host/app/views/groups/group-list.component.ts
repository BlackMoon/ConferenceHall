import { Component, EventEmitter, Output } from '@angular/core';
import { Logger } from "../../common/logger";
import { Observer } from "../../common/observer";
import { GroupModel } from '../../models';
import { GroupService } from './group.service';

@Component({
    selector: 'element-group-list',
    templateUrl: 'group-list.component.html'
})
export class GroupListComponent {

    groups: GroupModel[];

    constructor(
        private groupService: GroupService,
        private logger: Logger,
        private observer: Observer) {

    }

    ngOnInit() {
        
        this.groupService
            .getAll()
            .subscribe(
                groups => this.groups = groups,
                error => this.logger.error(error));
    }

    itemClick = (group: GroupModel) => this.observer.send("groupList_itemClicked", group);
}