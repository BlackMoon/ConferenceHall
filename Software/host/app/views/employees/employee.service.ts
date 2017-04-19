import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { IDataService } from '../../common/data-service';
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
            .map((r: Response) => r.json());

    }

    update(employee): Observable<any> {
        return Observable.of(null);
    }
}