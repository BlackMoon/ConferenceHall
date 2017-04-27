import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { IDataService } from '../../common/data-service';
import { GroupModel } from '../../models/index';

import MapUtils from '../../common/map-utils';

const url = "/api/groups";
//const url = "http://webtest.aquilon.ru:810/api/elements";

@Injectable()
export class GroupService implements IDataService<GroupModel> {

    constructor(private http: Http) { }

    add(group): Observable<any> {

        return this.http
            .post(url, group)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {

        return Observable.empty();
    }

    getAll(): Observable<any> {
        
        return this.http
            .get(url)
            .map((r: Response) => r
                .json()
                .map(g => MapUtils.deserialize(GroupModel, g))
            )
            .catch(handleResponseError);
    }

    get(key): Observable<any> {

        return Observable.empty();
    }

    update(element): Observable<any> {

        return Observable.empty();
    }
}