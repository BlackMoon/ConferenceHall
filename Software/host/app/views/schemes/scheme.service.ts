import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { IDataService } from '../../common/data-service';
import { SchemeModel } from '../../models/index';

const url = "/api/schemes";
//const url = "http://webtest.aquilon.ru:810/api/halls";

@Injectable()
export class SchemeService implements IDataService<SchemeModel> {

    constructor(private http: Http) { }

    add(scheme): Observable<any> {

        return this.http
            .post(url, scheme)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {

        return this.http
            .delete(`${url}/${key}`)
            .catch(handleResponseError);
    }

    getAll = ():Observable<any> => Observable.empty();

    get(key): Observable<any> {

        return this.http
            .get(`${url}/${key}`)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }

    update(scheme): Observable<any> {

        return this.http
            .put(`${url}/${scheme.id}`, scheme)
            .catch(handleResponseError);
    }
}