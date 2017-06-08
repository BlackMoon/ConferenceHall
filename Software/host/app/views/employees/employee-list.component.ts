import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../models';
import { EmployeeService } from './employee.service';
import { Logger } from "../../common/logger";

const minChars = 3;

@Component({
    selector: "member-list",
    templateUrl: 'member-list.component.html'
})

export class EmployeeListComponent implements OnInit {

    filter: string;
    employees: EmployeeModel[];

    selectedMemberIds: number[] = [];

    @Output() selectionChanged = new EventEmitter<number[]>();

    constructor(
        private employeeService: EmployeeService,
        private logger: Logger) { }


    ngOnInit() {
        this.loadEmployees();
    }

    /**
     * Handle input text value change
     * @param value
     */
    filterChange(value) {
        
        this.filter = value;
        if (value.length >= minChars || !value.length) {
            this.loadEmployees();
            this.selectedMemberIds = [];
        }
    }

    /**
    * Handle enter key press
    */
    filterKeyPressed(event) {
        (event.keyCode === 13) && this.filterChange(event.target.value);
    }

    loadEmployees() {

        this.employeeService
            .getAll(this.filter)
            .subscribe(
                employees => this.employees = employees,
                error => this.logger.error2(error));    
    }

    selectEmploye(employee) {
        employee.selected = !employee.selected;

        if (employee.selected)
            this.selectedMemberIds.push(employee.id);
        else {
            let ix = this.selectedMemberIds.indexOf(employee.id);
            this.selectedMemberIds.splice(ix, 1);
        }

        this.selectionChanged.emit(this.selectedMemberIds);
    }
}