import { Component, EventEmitter, Output } from '@angular/core';
import { Logger } from "../../common/logger";
import { GroupModel } from '../../models';
import { GroupService } from './group.service';

@Component({
    selector: 'element-group-list',
    templateUrl: 'group-list.component.html'
})
export class GroupListComponent {

    groups: GroupModel[];

    // event Handlers
    @Output() itemClicked: EventEmitter<GroupModel> = new EventEmitter();

    constructor(
        private groupService: GroupService,
        private logger: Logger) {
        
    }

    ngOnInit() {

        this.groupService
            .getAll()
            .subscribe(
                groups => this.groups = groups,
                error => this.logger.error(error));
    }

    itemClick = (group: GroupModel) => this.itemClicked.emit(group);
}