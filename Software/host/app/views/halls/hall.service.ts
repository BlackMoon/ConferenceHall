import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/http-data.service';
import { HallModel } from '../../models/index';

import MapUtils from '../../common/map-utils';

@Injectable()
export class HallService extends HttpDataService<HallModel> {
    
    url: string = isDevMode() ? "http://localhost:64346/api/halls" : "api/halls";

    constructor(http: Http) { super(http); }

    get(key): Observable<HallModel> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r:Response) => MapUtils.deserialize(HallModel, r.json()))
            .catch(handleResponseError);
    }

    /**
     * Удаляет схемы
     * @param ids
     */
    delete(ids: number[]): Observable<any> {

        let c = { ids: ids };

        return this.http
            .post(`${this.url}/delete`, c)
            .catch(handleResponseError);
    }
}