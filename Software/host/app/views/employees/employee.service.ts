import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { IDataService } from '../../common/data-service';
import MapUtils from '../../common/map-utils';
import { EmployeeModel } from '../../models/index';

const url = "http://webtest.aquilon.ru:810/api/employees";

@Injectable()
export class EmployeeService implements IDataService<EmployeeModel> {

    constructor(private http: Http) { }

    add(employee): Observable<any> {
        return Observable.of(null);
    }

    delete(key): Observable<any> {
        return Observable.of(null);
    }

    getAll(): Observable<any> {

        return this.http
            .get(url)
            .map((r: Response) => r.json());

    }

    get(key): Observable<any> {

        return this.http
            .get(url)
            .map((r: Response) => {
                let employee = MapUtils.deserialize(EmployeeModel, r.json());
                employee.schemes = [{ id: 1, name: 'First' }, { id: 2, name: 'Second' }];
                return employee;
            });
    }

    update(employee): Observable<any> {
        return Observable.of(null);
    }
}