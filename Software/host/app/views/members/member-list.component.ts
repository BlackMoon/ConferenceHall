import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberModel } from '../../models';
import { MemberService } from './member.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";


const minChars = 3;
@Component({
    selector: "member-list",
    styleUrls: [`member-list.component.css`],
    templateUrl: 'member-list.component.html'
})


export class MemberListComponent implements OnInit {

    members: MemberModel[];
    filter: string;
    header: string;
   

    @Input()
    selectedMember: MemberModel;
   
    constructor(
        private confirmationService: ConfirmationService,
        private memberService: MemberService,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }
  

    ngOnInit() {
      
        this.memberService
            .getAll()
            .subscribe(members => this.members = members,
                error => this.logger.error(error));
       
    }
    loadMemberLazy(event: LazyLoadEvent) {

        this.memberService
            .getAll()
            .subscribe(members => this.members = this.members,
            error => this.logger.error(error));
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
                    error => this.logger.error(error))

        });       
    }
    //selectMember(member) {
    //    debugger;
    //    if (!member.selected) {
    //        for (let memb of this.members) {
    //            memb.selected = (memb.id === member.id);
    //        }
    //        this.selectedMember = member;
    //    }        
    //}
    filterChange(value) {
        
        this.filter = value;

        if (value.length >= minChars) {
            this.memberService
                .getAll(value)
                .subscribe(members => this.members = members,
                error => this.logger.error(error));
          
        }
    }

    /**
     * Handle enter key press
     */
    filterKeyPressed(event) {
       
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    addMember() {
        debugger;
        this.router.navigate(["members/new"], { relativeTo: this.route });
        
        }  

}