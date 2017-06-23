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
     * Добавить участников (список) в конференцию
     * @param confId
     * @param members
     * возвращает созданных участников (с id)
     */
    addMembers(confId, members: MemberModel[]): Observable<any> {

        let body = { conferenceId: confId, members: members };

        return this.http
            .post(`${this.url}`, body)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }


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

    /**
     * Поменять место
     * @param memberid     
     */
    changeState(memberid: number, state): Observable<any> {

        let body = [{ op: 'replace', path: '/state', value: state }];

        return this.http
            .patch(`${this.url}/${memberid}`, body)
            .catch(handleResponseError);
    }

    /**
     * Удаляет участников
     * @param c
     */
    delete(ids: number[]): Observable<any> {

        let c = { ids: ids };

        return this.http
            .post(`${this.url}/delete`, c)
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