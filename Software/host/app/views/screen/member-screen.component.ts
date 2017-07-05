import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { MemberModel, MemberState } from '../../models';
import { MemberService } from '../members/member.service';
import { Logger } from "../../common/logger";

const duration = 1000;
const scrollStep = 0.2;

@Component({
    selector: "member-screen",
    styleUrls: [`member-screen.component.css`],
    templateUrl: 'member-screen.component.html'
})

export class MemberScreenComponent implements AfterViewInit {

    loading: boolean;

    // datatable wrapper element
    wrapper: any;

    // ReSharper disable once InconsistentNaming
    public MemberState = MemberState;    

    @Input()
    members: MemberModel[];

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
   

    @Output() membersLoaded: EventEmitter<MemberModel[]> = new EventEmitter<MemberModel[]>();   

    constructor(
        private el: ElementRef,
        private memberService: MemberService,
        private logger: Logger) { }


    ngAfterViewInit() {        
        this.wrapper = this.el.nativeElement.querySelector(".ui-datatable-tablewrapper");
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

    /**
     * Easing function: easeInOutCubic
     * From: https://gist.github.com/gre/1650294
     */
    easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; 

    getMember = id => this.members.find(m => m.id === id);

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

    scroll() {
        
        if (this.wrapper && this.wrapper.scrollHeight > this.wrapper.clientHeight) {
           
            // check whether scrollEnd or not
            let delta = this.wrapper.clientHeight * scrollStep,
                scrollTop = this.wrapper.scrollTop < this.wrapper.scrollHeight - this.wrapper.clientHeight ? this.wrapper.scrollTop : -delta,
                start: number;

            var callback: FrameRequestCallback = time => {

                if (!start)
                    start = time;

                let elapsed = time - start,                                 // Elapsed miliseconds since start of scrolling.
                    percent = Math.min(elapsed / duration, 1);              // Get percent of completion in range [0, 1].
              
                percent = this.easing(percent);

                this.wrapper.scrollTop = scrollTop + delta * percent;
                elapsed < duration && window.requestAnimationFrame(callback);
            };

            window.requestAnimationFrame(callback);
        }
    }
}