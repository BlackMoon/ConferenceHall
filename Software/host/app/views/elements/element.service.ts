import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { IDataService } from '../../common/data-service';
import { AddToFavoritesModel, ElementModel } from '../../models';

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

    delete(ids:number[]): Observable<any> {

        let queryParams = [];
        for (let id of ids) {
            queryParams.push(`ids=${id}`);
        }

        return this.http
            .delete(url + (queryParams.length > 0 ? `?${queryParams.join("&")}` : ""))
            .catch(handleResponseError);
    }

    getAll(filter?: string, groupid?:number): Observable<any> {

        let queryParams = [];

        filter && queryParams.push(`filter=${filter}`);
        groupid && queryParams.push(`groupid=${groupid}`);
        
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
     * Добавить/убрать из избранного
     */
    addToFavorites(m:AddToFavoritesModel): Observable<any> {
        
        return this.http
            .post(`/api/favorites`, m)
            .map(_ => m)
            .catch(handleResponseError);
    }
}