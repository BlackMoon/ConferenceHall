import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ScreenModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ScreenService extends HttpDataService<ScreenModel> {

    url = isDevMode() ? "http://localhost:64346/api/screens" : "/api/screens";

    constructor(http: Http) { super(http); }

    get(key): Observable<ScreenModel> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(ScreenModel, r.json()))
            .catch(handleResponseError);
    }

    /**
     * Поиск презентаций
     * @param startDate
     */
    getAll(startDate:Date): Observable<ScreenModel[]> {

        let d = startDate.getDate(),
            m = startDate.getMonth(),
            y = startDate.getFullYear();

        let params: URLSearchParams = new URLSearchParams();
        params.append("startDate", startDate.toUTCString());

        return this.http
            .get(this.url, { params: params })
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}