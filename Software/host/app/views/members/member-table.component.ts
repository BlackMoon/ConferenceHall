import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberModel, MemberState } from '../../models';
import { MemberService } from './member.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";

const minChars = 3;

@Component({
    selector: "member-table",
    styleUrls: [`member-table.component.css`],
    templateUrl: 'member-table.component.html'
})

export class MemberTableComponent implements OnInit {

// ReSharper disable once InconsistentNaming
    public MemberState = MemberState;

    members: MemberModel[];
    filter: string;

    @Input()
    conferenceId: number;

    @Output()
    membersLoaded: EventEmitter<MemberModel[]> = new EventEmitter<MemberModel[]>();
   
    constructor(
        private confirmationService: ConfirmationService,
        private memberService: MemberService,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.loadMembers();
    }

    addMember() {
        debugger;
        this.router.navigate(["members/new"], { relativeTo: this.route });
    }

    loadMembers() {
        
        this.memberService
            .getAll(null, this.conferenceId)
            .subscribe(
                members => {
                    this.members = members;
                    this.membersLoaded.emit(members);
                },
                error => this.logger.error2(error));    
    }

    loadMemberLazy(event: LazyLoadEvent) {

        this.memberService
            .getAll()
            .subscribe(
                members => this.members = members,
                error => this.logger.error2(error));
    }

    removeMember(id: number, name?: string) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () =>

                this.memberService
                    .delete(id)
                    .subscribe(
                    _ => {

                        let ix = this.members.findIndex(h => h.id === id);
                        this.members.splice(ix, 1);
                    },
                    error => this.logger.error2(error))

        });       
    }
    
    filterChange(value) {
        
        this.filter = value;
        value.length >= minChars && this.loadMembers();
    }

    /**
     * Handle enter key press
     */
    filterKeyPressed(event) {
       
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }
}