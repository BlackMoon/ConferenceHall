import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../models';
import { EmployeeService } from './employee.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";


@Component({
    styleUrls: [`employee-list.css`],
    templateUrl: 'employee-list.html'
})
export class EmployeeListComponent implements OnInit {

    employees: EmployeeModel[] = [{ name: 'Имя клиента', jobTitle: 'Разработчик', emailsList:[], phonesList:[] }];

    constructor(
        private confirmationService: ConfirmationService,
        private employeeService: EmployeeService,
        private logger: Logger,
        private router: Router) { }
  

    ngOnInit() {

        this.employeeService
            .getAll()
            .subscribe(employees => this.employees = this.employees.concat(employees));
    }

    removeEmployee(id:number) {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить [${name}]?`,
            accept: () =>

                this.employeeService
                    .delete(id)
                    .subscribe(
                    _ => {

                        let ix = this.employees.findIndex(h => h.id === id);
                        this.employees.splice(ix, 1);
                    },
                    error => this.logger.error(error))

        });

        
    }
    loadEmployeeLazy(event: LazyLoadEvent) {
       
        this.employeeService
            .getAll()
            .subscribe(employees => this.employees = this.employees.concat(employees));
    }
}