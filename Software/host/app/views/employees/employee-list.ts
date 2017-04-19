import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../models';
import { EmployeeService } from './employee.service';


@Component({
    styleUrls: [`employee-list.css`],
    templateUrl: 'employee-list.html'
})
export class EmployeeListComponent implements OnInit {

    employees: EmployeeModel[] = [{ name: 'Имя клиента', job_title: 'Разработчик', emails_list:[], phones_list:[] }];

    constructor(private employeeService: EmployeeService) { }

    ngOnInit() {

        this.employeeService
            .getAll()
            .subscribe(employees => this.employees = this.employees.concat(employees));
    }

    removeEmployee(id:number) {

        this.employeeService
            .delete(id)
            .subscribe(_ => {
                let ix = this.employees.findIndex(h => h.id === id);
                this.employees.slice(ix, 1);
            });

        
    }
}