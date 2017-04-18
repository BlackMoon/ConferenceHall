import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { IDataService } from '../../common/data-service';
//import { MapUtils } from '../../common/map-utils';
import { HallModel } from '../../models/index';

const url = "http://webtest.aquilon.ru:810/api/halls";

@Injectable()
export class HallService implements IDataService<HallModel> {

    constructor(private http: Http) {}

    add(hall): Observable<any> {
        return Observable.of(null);
    }

    delete(key): Observable<any> {
        return Observable.of(null);
    }

    getAll(): Observable<any> {

        return this.http
            .get(url)
            .map((r: Response) => {
                debugger;
                
                //let a = MapUtils.deserialize(HallModel, r.json());
                return r.json();
            });
    }

    get(key): Observable<any> {

        return this.http
            .get(url)
            .map((r: Response) => r.json());

    }

    update(hall): Observable<any> {
        return Observable.of(null);
    }
}