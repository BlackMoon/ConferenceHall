import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { SchemeModel } from '../../models';
import MapUtils from '../../common/map-utils';

@Injectable()
export class SchemeService extends HttpDataService<SchemeModel> {
    
    url = isDevMode() ? "http://localhost:64346/api/schemes1s" : "/api/schemes";

    constructor(http: Http) { super(http); }

    /**
     * Добавить/убрать из избранного
     */
    copy(key): Observable<any> {

        return this.http
            .post(`/api/schemes/copy`, key)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }

    getAll(hallId?: number, filter?: string): Observable<any> {

        let params: URLSearchParams = new URLSearchParams();

        hallId && params.append("hallId", hallId.toString());
        filter && params.append("filter", filter);

        return this.http
            .get(this.url, { params: params })
            .map((r: Response) => r
                .json()
                .map(el => MapUtils.deserialize(SchemeModel, el))
            )
            .catch(handleResponseError);
    }
}