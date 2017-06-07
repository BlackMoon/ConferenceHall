﻿import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { MemberModel } from '../../models';
import { ContactModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class MemberService extends HttpDataService<MemberModel> {
    url: string = isDevMode() ? "http://localhost:64346/api/members" : "api/members";
    constructor(http: Http) { super(http); }

    add(member): Observable<any> {

        let formData: FormData = new FormData();
        formData.append("name", member.name);
        formData.append("job_title", member.job_title);
        formData.append("contacts", member.contacts);
        return this.http
            .post(this.url, formData)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {
        return Observable.of(null);
    }

    getAll(filter?: string, confid?: number): Observable<any> {
        
        let params: URLSearchParams = new URLSearchParams();
        filter && params.append("filter", filter);
        confid && params.append("confid", confid.toString());
       
        return this.http
            .get(this.url, { params: params })
            .map((r: Response) => r
                .json()
                .map(m => MapUtils.deserialize(MemberModel, m))
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