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

    getAll(state: ConfState, startDate: Date, endDate: Date): Observable<any> {

        let queryParams = [`state=${state}`];

        // [активные, на подготовке, завершенные] совещания фильтруются по дате
        if (state !== ConfState.Planned) {
            queryParams.push(`startDate=${startDate}`);
            queryParams.push(`endDate=${endDate}`);
        }    

        return this.http
            .get(`${this.url}?${queryParams.join("&")}`)
            .map((r: Response) => r
                .json()
                .map(conf => MapUtils.deserialize(ConferenceModel, conf))
            )
            .catch(handleResponseError);
    }
}