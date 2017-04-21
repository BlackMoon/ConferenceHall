import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { IDataService } from '../../common/data-service';
import { HallModel } from '../../models/index';

import MapUtils from '../../common/map-utils';

const url = "/api/halls";
//const url = "http://webtest.aquilon.ru:810/api/halls";

@Injectable()
export class HallService implements IDataService<HallModel> {

    constructor(private http: Http) {}

    add(hall): Observable<any> {

        return this.http
            .post(url, hall)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {

        return this.http
            .delete(`${url}\\${key}`)
            .catch(handleResponseError);
    }

    getAll(): Observable<any> {

        return this.http
            .get(url)
            .map((r: Response) => r
                    .json()
                    .map(h => MapUtils.deserialize(HallModel, h))
            )
            .catch(handleResponseError);
    }

    get(key): Observable<any> {

        return this.http
            .get(`${url}\\${key}`)
            .map((r: Response) => MapUtils.deserialize(HallModel, r.json()))
            .catch(handleResponseError);
    }

    update(hall): Observable<any> {

        return this.http
            .put(`${url}\\${hall.id}`, hall)
            .catch(handleResponseError);
    }
}