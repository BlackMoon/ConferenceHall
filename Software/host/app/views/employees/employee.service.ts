import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { EmployeeModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class EmployeeService extends HttpDataService<EmployeeModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/employees" : "api/employees";

    constructor(http: Http) { super(http); }

    add(employee): Observable<any> {

        let formData: FormData = new FormData();
        formData.append("name", employee.name);
        formData.append("position", employee.position);
        formData.append("job", employee.job);
        formData.append("lockedInt", employee.lockedInt);
        formData.append("role", employee.role);
        formData.append("contacts", employee.contacts);
        return this.http
            .post(this.url, formData)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {
        return Observable.of(null);
    }

    get(key): Observable<any> {
        debugger;
        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(EmployeeModel, r.json()))
            .catch(handleResponseError);
    }

    update(employee): Observable<any> {
        return Observable.of(null);
    }
}