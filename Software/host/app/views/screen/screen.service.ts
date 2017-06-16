import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ScreenModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ScreenService {

    url = isDevMode() ? "http://localhost:64346/api/screen" : "/api/screen";

    constructor(private http: Http) { }

    get(key): Observable<ScreenModel> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(ScreenModel, r.json()))
            .catch(handleResponseError);
    }
}