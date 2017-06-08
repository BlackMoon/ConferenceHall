import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { FindOrganizationsQuery, EmployeeModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class EmployeeService extends HttpDataService<EmployeeModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/members" : "api/members";

    constructor(http: Http) { super(http); }

    add(member): Observable<any> {

        let formData: FormData = new FormData();
        formData.append("name", member.name);
        formData.append("jobTitle", member.jobTitle);
        formData.append("contacts", member.contacts);
        return this.http
            .post(this.url, formData)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {
        return Observable.of(null);
    }

    getAll(filter?: string, confid?: number, orgIds: number[] = null): Observable<any> {
       
        let body: FindOrganizationsQuery = { conferenceId: confid, filter: filter, organizationIds: orgIds };

        return this.http
            .post(`${this.url}/search`, body)
            .map((r: Response) => r
                .json()
                .map(m => MapUtils.deserialize(EmployeeModel, m))
            )
            .catch(handleResponseError);
    }

    get(key): Observable<any> {
        debugger;
        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(MemberModel, r.json()))
            .catch(handleResponseError);
    }

    update(member): Observable<any> {
        return Observable.of(null);
    }
}