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

        let formData: FormData = new FormData();
        formData.append("name", element.name);
        formData.append("data", element.image, element.image.name);
        formData.append("height", element.height);
        formData.append("width", element.width);

        return this.http
            .post(url, formData)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {

        return Observable.empty();
    }

    getAll(filter?: string, group?:string): Observable<any> {

        let queryParams = [];

        filter && queryParams.push(`filter=${filter}`);
        group && queryParams.push(`group=${group}`);
        
        return this.http
            .get(url + (queryParams.length > 0 ? `?${queryParams.join("&")}` : ""))
            .map((r: Response) => r
                .json()
                .map(el => MapUtils.deserialize(ElementModel, el))
            )
            .catch(handleResponseError);
    }

    get(key): Observable<any> {

        return Observable.empty();
    }

    update(element): Observable<any> {

        return Observable.empty();
    }

    /**
     * Добавить/убрать в избранного
     */
    addToFavorite(key: number, favorite: boolean): Observable<any> {
        
        return this.http
            .patch(`/api/favorite/${key}`, [{ op: "replace", path: "/favorite", value: favorite }])
            .catch(handleResponseError);
    }
}