import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { HallModel } from '../../models';
import { HallService } from './hall.service';

@Component({
    styleUrls: [`hall-list.component.css`],
    templateUrl: 'hall-list.component.html'
})
export class HallListComponent implements OnInit {

    halls: HallModel[] = [<any>{ name: 'Создать', description: 'Новый холл' }];

    constructor(
        private confirmationService: ConfirmationService,
        private hallService: HallService,
        private logger: Logger) { }

    ngOnInit() {

        this.hallService
            .getAll()
            .subscribe(
                halls => this.halls = this.halls.concat(halls),
                error => this.logger.error(error));
    }

    removeHall(id:number, name?: string) {
       
        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () => 
                
                this.hallService
                    .delete(id)
                    .subscribe(
                        _ => {
                    
                            let ix = this.halls.findIndex(h => h.id === id);
                            this.halls.splice(ix, 1);
                        },
                        error => this.logger.error(error))
            
        });
    }
}