import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { FindMembersQuery, MemberModel } from '../../models';

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


    getAll(confid?: number, organizationIds: number[] = null): Observable<any> {

        let body: FindMembersQuery = {};
        confid && (body.conferenceId = confid);
        organizationIds && organizationIds.length > 0 && (body.organizationIds = organizationIds);

        return this.http
            .post(`${this.url}/search`, body)
            .map((r: Response) => r
                .json()
                .map(m => MapUtils.deserialize(MemberModel, m))
            )
            .catch(handleResponseError);
    }
}