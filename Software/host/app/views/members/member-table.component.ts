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

    // ReSharper disable once InconsistentNaming
    public MemberState = MemberState;
   
    /**
     * Доступные места
     */
    @Input()
    availableSeats: SelectItem[] = [{ label: '1', value: '1' }, { label: '5', value: '5' }];

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
    editable: boolean = true;

    @Input()
    selectionMode: string;

    @Output()
    membersLoaded: EventEmitter<MemberModel[]> = new EventEmitter<MemberModel[]>();

    @Output() selectionChanged = new EventEmitter<MemberModel[]>();

    constructor(
        private memberService: MemberService,
        private logger: Logger) { }

    changeSeat(member) {
        
        this.memberService
            .changeSeat(member.id, member.seat)
            .subscribe(
                _ => {},
                error => this.logger.error2(error));
    }

    loadMembers() {
        
        this.memberService
            .getAll(this.conferenceId)
            .subscribe(
                members => {
                    this.members = members;
                    this.membersLoaded.emit(members);
                },
                error => this.logger.error2(error));    
    }

    selectRow(e) {
       this.selectionChanged.emit(this.selectedMembers);
    }

    unSelectRow(e) {
        this.selectionChanged.emit(this.selectedMembers);
    }
}