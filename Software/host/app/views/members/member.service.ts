import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { MemberModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class MemberService extends HttpDataService<MemberModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/members" : "api/members";

    constructor(http: Http) { super(http); }

    /**
     * Поменять место
     * @param memberid     
     */
    changeSeat(memberid: number, seat): Observable<any> {

        let body = [{ op: 'replace', path: '/seat', value: seat }];

        return this.http
            .patch(`${this.url}/${memberid}`, body)
            .catch(handleResponseError);
    }


    getAll(confid: number): Observable<any> {

        return this.http
            .get(`${this.url}/${confid}`)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}