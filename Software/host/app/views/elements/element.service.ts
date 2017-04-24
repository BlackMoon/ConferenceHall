import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { IDataService } from '../../common/data-service';
import { ElementModel } from '../../models/index';

import MapUtils from '../../common/map-utils';

const url = "/api/elements";
//const url = "http://webtest.aquilon.ru:810/api/elements";

@Injectable()
export class ElementService implements IDataService<ElementModel> {

    constructor(private http: Http) { }

    add(element): Observable<any> {

        return this.http
            .post(url, element)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {

        return Observable.empty();
    }

    getAll(group?:string, filter?: string): Observable<any> {

        return this.http
            .get(`${url}\\filter=${filter}\\group=${group}`)
            .map((r: Response) => r
                .json()
                .map(h => MapUtils.deserialize(ElementModel, h))
            )
            .catch(handleResponseError);
    }

    get(key): Observable<any> {

        return Observable.empty();
    }

    update(hall): Observable<any> {

        return Observable.empty();
    }
}