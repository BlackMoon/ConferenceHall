import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/http-data.service';
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
            m = startDate.getMonth() + 1,       // month starts with 0
            y = startDate.getFullYear();

        let params: URLSearchParams = new URLSearchParams();
        params.append("startDate", `${y}-${m}-${d}`);

        return this.http
            .get(this.url, { params: params })
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}