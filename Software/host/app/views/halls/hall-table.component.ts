import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { HallModel, GroupCommand } from '../../models';
import { HallService } from './hall.service';

@Component({
    selector: 'hall-table',
    templateUrl: 'hall-table.component.html'
})
export class HallTableComponent implements OnInit {

    editMode: boolean;
    loading: boolean;

    halls: HallModel[];
    selectedHalls: HallModel[] = [];

    /**
     * Режим чтения (для вставки в другой компонент)
     */
    @Input()
    readOnly: boolean;

    @Output() selectionChanged = new EventEmitter<GroupCommand>();

    constructor(
        private confirmationService: ConfirmationService,
        private hallService: HallService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {

        this.loading = true;
        this.hallService
            .getAll()
            .subscribe(
                halls => {
                    this.halls = halls;
                    this.loading = false;
                },
                error => {
                    this.logger.error2(error);
                    this.loading = false;
                });
    }

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedHalls.length = 0;
    }

    removeRows() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: 'Удалить выбранные записи?',
            accept: _ => {                

                this.hallService
                    .delete(this.selectedHalls.map(h => h.id))
                    .subscribe(
                    _ => {
                        
                        let ids = this.selectedHalls.map(h => h.id);
                        this.halls = this.halls.filter(h => ids.indexOf(h.id) === -1);
                        
                        this.selectedHalls.length = 0;
                    },
                    error => this.logger.error2(error));
            }
        });
    }

    selectRow(e) {

        if (!this.editMode) {
            
            let id = e.data["id"];

            if (this.readOnly) {
                
                let ids = this.selectedHalls.map(h => h.id);
                (ids.indexOf(id) === -1) && ids.push(id);
                
                let c: GroupCommand = { ids: ids };
                    this.selectionChanged.emit(c);
            }
            else
                this.router.navigate(["/halls", id]);
        }
    }

    unSelectRow(e) {
        
        if (this.readOnly) {
            
            let id = e.data["id"],
                ids = this.selectedHalls.map(h => h.id),
                ix = ids.indexOf(id);

            (ix !== -1) && ids.splice(ix, 1);

            let c: GroupCommand = { ids: ids };
            this.selectionChanged.emit(c);
        }
    }
}