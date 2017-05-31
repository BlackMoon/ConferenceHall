import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { MemberModel } from '../../models';

import MapUtils from '../../common/map-utils';




@Injectable()
export class MemberService extends HttpDataService<MemberModel> {
    url: string = isDevMode() ? "http://localhost:64346/api/members" : "api/members";
    constructor(http: Http) { super(http); }

    add(member): Observable<any> {
        return Observable.of(null);
    }

    delete(key): Observable<any> {
        return Observable.of(null);
    }

    getAll(filter?: string, groupid?: number): Observable<any> {

        let queryParams = [];

        filter && queryParams.push(`filter=${filter}`);
       
        return this.http
            .get(this.url + (queryParams.length > 0 ? `?${queryParams.join("&")}` : ""))
            .map((r: Response) => r
                .json()
                .map(el => MapUtils.deserialize(MemberModel, el))
            )
            .catch(handleResponseError);
    }

    get(key): Observable<any> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(MemberModel, r.json()))
            .catch(handleResponseError);
    }

    update(member): Observable<any> {
        return Observable.of(null);
    }
}