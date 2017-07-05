import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/http-data.service';
import { GroupModel } from '../../models/index';

import MapUtils from '../../common/map-utils';

@Injectable()
export class GroupService extends HttpDataService<GroupModel> {

    url = isDevMode() ? "http://localhost:64346/api/groups" : "/api/groups";
    
    constructor(http: Http) { super(http); }

    getAll(): Observable<any> {

        return this.http
            .get(this.url)
            .map((r: Response) => r
                .json()
                .map(g => MapUtils.deserialize(GroupModel, g))
            )
            .catch(handleResponseError);
    }
}

    