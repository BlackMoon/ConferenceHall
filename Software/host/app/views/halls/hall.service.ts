import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { HallModel } from '../../models/index';

import MapUtils from '../../common/map-utils';

@Injectable()
export class HallService extends HttpDataService<HallModel> {

    url: string = "api/halls";
    //url: string = "http://webtest.aquilon.ru:810/api/halls";

    constructor(http: Http) { super(http); }

    get(key): Observable<HallModel> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r:Response) => MapUtils.deserialize(HallModel, r.json()))
            .catch(handleResponseError);
    }

    getAll(): Observable<any> {
        
        return this.http
            .get(this.url)
            .map((r: Response) => r
                    .json()
                    .map(h => MapUtils.deserialize(HallModel, h))
            )
            .catch(handleResponseError);
    }
}