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

    get(key): Observable<any> {
        
        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(EmployeeModel, r.json()))
            .catch(handleResponseError);
    }
}