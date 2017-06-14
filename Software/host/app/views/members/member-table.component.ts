import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberModel, MemberState } from '../../models';
import { MemberService } from './member.service';
import { Logger } from "../../common/logger";

@Component({
    selector: "member-table",
    styleUrls: [`member-table.component.css`],
    templateUrl: 'member-table.component.html'
})

export class MemberTableComponent implements OnInit {

    // ReSharper disable once InconsistentNaming
    public MemberState = MemberState;
   
    members: MemberModel[];

    @Input()
    conferenceId: number;

    @Output()
    membersLoaded: EventEmitter<MemberModel[]> = new EventEmitter<MemberModel[]>();

    constructor(
        private memberService: MemberService,
        private logger: Logger) { }

    ngOnInit() {
        this.memberService
            .getAll(this.conferenceId)
            .subscribe(
                members => {
                    this.members = members;
                    this.membersLoaded.emit(members);
                },
            error => this.logger.error2(error));
    }
}