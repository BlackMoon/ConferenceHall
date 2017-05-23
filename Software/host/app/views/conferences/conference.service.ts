import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ConferenceModel, ConfState } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ConferenceService extends HttpDataService<ConferenceModel> {

    url = isDevMode() ? "http://localhost:64346/api/conferences" : "/api/conferences";

    constructor(http: Http) { super(http); }

    getAll(state: ConfState): Observable<any> {
        
        return this.http
            .get(`${this.url}?state=${state}`)
            .map((r: Response) => r
                .json()
                .map(conf => MapUtils.deserialize(ConferenceModel, conf))
            )
            .catch(handleResponseError);
    }
}