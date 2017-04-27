import { Component } from '@angular/core';
import { IEmitEvent, Observer } from "../../common/observer";
import { GroupModel } from '../../models';

@Component({
    selector: 'scheme-toolbox',
    templateUrl: 'scheme-toolbox.component.html'
})
export class SchemeToolboxComponent {

    constructor(private observer: Observer) {
        
        observer.notify("groupList_itemClicked")
            .subscribe((event:IEmitEvent<GroupModel>) => {
                
                let group: GroupModel = event.value;
                console.log(group);
            });
    }
    
}