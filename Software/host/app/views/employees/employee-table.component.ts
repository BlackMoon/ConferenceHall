import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../models';
import { EmployeeService } from './employee.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";

const minChars = 3;

@Component({
    selector: "employee-table",
    styleUrls: [`employee-table.component.css`],
    templateUrl: 'employee-table.component.html'
})

export class EmployeeTableComponent implements OnInit {

// ReSharper disable once InconsistentNaming
   
    filter: string;
    employees: EmployeeModel[];

    @Output()
    employeesLoaded: EventEmitter<EmployeeModel[]> = new EventEmitter<EmployeeModel[]>();
   
    constructor(
        private confirmationService: ConfirmationService,
        private employeeService: EmployeeService,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.loademployees();
    }

    addemployee() {
        this.router.navigate(["employees/new"]);
    }

    loademployees() {
        
        this.employeeService
            .getAll(this.filter)
            .subscribe(
                employees => {
                    this.employees = employees;
                    this.employeesLoaded.emit(employees);
                },
                error => this.logger.error2(error));    
    }

    loademployeeLazy(event: LazyLoadEvent) {

        this.employeeService
            .getAll()
            .subscribe(
                employees => this.employees = employees,
                error => this.logger.error2(error));
    }

    removeemployee(id: number, name?: string) {

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
                    error => this.logger.error2(error))

        });       
    }
    
    filterChange(value) {
        
        this.filter = value;
        if (value.length >= minChars || !value.length) 
            this.loademployees();
    }

    /**
     * Handle enter key press
     */
    filterKeyPressed(event) {
       
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }
    onRowSelect(event) {
        this.router.navigate(["employees/", event.data.id]);
    }
}