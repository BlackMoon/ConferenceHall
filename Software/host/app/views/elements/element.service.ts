import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ElementGroupCommand, ElementModel } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ElementService extends HttpDataService<ElementModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/elements" : "api/elememts";

    constructor(http: Http) { super(http);  }

    add(element): Observable<any> {

        let formData: FormData = new FormData();
        formData.append("name", element.name);
        formData.append("data", element.image, element.image.name);
        formData.append("height", element.height);
        formData.append("width", element.width);

        return this.http
            .post(this.url, formData)
            .catch(handleResponseError);
    }

    /**
     * Удалить элементы из группы
     * @param c
     */
    delete(c: ElementGroupCommand): Observable<any> {
        
        return this.http
            .post("/api/elements/delete", c)
            .map(_ => c.ids)
            .catch(handleResponseError);
    }

    getAll(filter?: string, groupid?:number): Observable<any> {

        let queryParams = [];

        filter && queryParams.push(`filter=${filter}`);
        groupid && queryParams.push(`groupid=${groupid}`);
        
        return this.http
            .get(this.url + (queryParams.length > 0 ? `?${queryParams.join("&")}` : ""))
            .map((r: Response) => r
                .json()
                .map(el => MapUtils.deserialize(ElementModel, el))
            )
            .catch(handleResponseError);
    }

    update(element): Observable<any> {

        let formData: FormData = new FormData();
        formData.append("name", element.name);
        formData.append("height", element.height);
        formData.append("width", element.width);

        element.image && formData.append("data", element.image, element.image.name);

        return this.http
            .put(`${this.url}/${element.id}`, formData)
            .catch(handleResponseError);
    }

    /**
     * Добавить/убрать из избранного
     */
    addToFavorites(c:ElementGroupCommand): Observable<any> {
        
        return this.http
            .post(`/api/favorites`, c)
            .catch(handleResponseError);
    }
}