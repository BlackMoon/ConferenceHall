import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { HallModel } from '../../models';
import { HallService } from './hall.service';

@Component({
    templateUrl: 'hall-table.component.html'
})
export class HallTableComponent implements OnInit {

    editMode: boolean;

    halls: HallModel[];
    selectedHalls: HallModel[] = [];

    /**
     * Режим чтения (для вставки в другой компонент)
     */
    @Input()
    readOnly: boolean;

    constructor(
        private confirmationService: ConfirmationService,
        private hallService: HallService,
        private logger: Logger,
        private router: Router) { }

    ngOnInit() {

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = halls,
                error => this.logger.error2(error));
    }

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedHalls.length = 0;
    }

    removeRows() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить выбранные записи?`,
            accept: _ => {

                let c = { ids: this.selectedHalls.map(h => h.id) };

                this.hallService
                    .delete(c)
                    .subscribe(
                    _ => {

                        this.selectedHalls.forEach(h => {
                            let ix = this.halls.findIndex(n => n.id === h.id);
                            this.halls.splice(ix, 1);
                        });

                        this.selectedHalls.length = 0;
                    },
                    error => this.logger.error2(error));
            }
        });
    }

    selectRow(e) {

        !this.editMode && this.router.navigate(["/halls", e.data["id"]]);
    }
}