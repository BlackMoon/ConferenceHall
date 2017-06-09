import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberModel } from '../../models';
import { MemberService } from './member.service';
import { Logger } from "../../common/logger";

const minChars = 3;

@Component({
    selector: "member-list",
    templateUrl: 'member-list.component.html'
})

export class MemberListComponent implements OnInit {

    filter: string;
    members: MemberModel[];

    selectedMemberIds: number[] = [];

    @Output() selectionChanged = new EventEmitter<number[]>();
    @Output()
    membersLoaded: EventEmitter<MemberModel[]> = new EventEmitter<MemberModel[]>();
    constructor(
        private memberService: MemberService,
        private logger: Logger) { }


    ngOnInit() {
        this.loadMembers();
    }

    /**
     * Handle input text value change
     * @param value
     */
    filterChange(value) {
        
        this.filter = value;
        if (value.length >= minChars || !value.length) {
            this.loadMembers();
            this.selectedMemberIds = [];
        }
    }

    /**
    * Handle enter key press
    */
    filterKeyPressed(event) {
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    loadMembers() {

        this.memberService
            .getAll(this.filter)
            .subscribe(
                members => this.members = members,
                error => this.logger.error2(error));    
    }

    selectMember(member) {
        member.selected = !member.selected;

        if (member.selected)
            this.selectedMemberIds.push(member.id);
        else {
            let ix = this.selectedMemberIds.indexOf(member.id);
            this.selectedMemberIds.splice(ix, 1);
        }

        this.selectionChanged.emit(this.selectedMemberIds);
    }
}