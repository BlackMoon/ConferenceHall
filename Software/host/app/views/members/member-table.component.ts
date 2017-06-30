import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectItem} from 'primeng/primeng';
import { MemberModel, MemberState } from '../../models';
import { MemberService } from './member.service';
import { Logger } from "../../common/logger";

@Component({
    selector: "member-table",
    styleUrls: [`member-table.component.css`],
    templateUrl: 'member-table.component.html'
})
 
export class MemberTableComponent {

    loading: boolean;

    // ReSharper disable once InconsistentNaming
    public MemberState = MemberState;
   
    /**
     * Доступные места
     */
    @Input()
    availableSeats: SelectItem[];
   

    @Input()
    members: MemberModel[];

    selectedMembers: MemberModel[] = [];

    // ReSharper disable InconsistentNaming
    private _conferenceId: number;

    get conferenceId(): number {
        return this._conferenceId;
    }

    @Input()
    set conferenceId(value: number) {
        this._conferenceId = value;
        value && this.loadMembers();
    }

    @Input()
    editable: boolean;

    @Input()
    selectionMode: string;

    @Output() seatChanged: EventEmitter<MemberModel> = new EventEmitter<MemberModel>();

    @Output() stateChanged: EventEmitter<MemberModel> = new EventEmitter<MemberModel>();

    @Output() membersLoaded: EventEmitter<MemberModel[]> = new EventEmitter<MemberModel[]>();

    @Output() selectionChanged = new EventEmitter<MemberModel[]>();

    constructor(
        private memberService: MemberService,
        private logger: Logger) { }
    
    changeSeat(seat, member: MemberModel) {
        
        member.seat = seat;
        this.seatChanged.emit(member);
        member.oldSeat = member.seat;
    } 

    changeState(checked, member: MemberModel) {
        
        member.state = checked ? MemberState.Confirmed : MemberState.Registered;
        this.stateChanged.emit(member);     
    }

    confirmMember(member) {

        let found = false;

        for (let i = 0; i < this.members.length; i++) {
            let m = this.members[i];

            if (m.id === member.id) {
                m.state = member.state;
                m.seat = member.seat;
                found = true;
            }
        }

        !found && this.members.push(member);
    }

    loadMembers() {

        this.loading = true;

        this.memberService
            .getAll(this.conferenceId)
            .subscribe(
                members => {
                    this.members = members;
                    this.membersLoaded.emit(members);
                    this.loading = false;
                },
                error => {
                    this.logger.error2(error);
                    this.loading = false;
                });    
    }

    removeMember(id) {

        let ix = this.members.findIndex(m => m.id === id);
        this.members.splice(ix, 1);
    }

    selectRow(e) {
       this.selectionChanged.emit(this.selectedMembers);
    }

    unSelectRow(e) {
        this.selectionChanged.emit(this.selectedMembers);
    }
}