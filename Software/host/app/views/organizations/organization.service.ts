import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { OrganizationModel, NodeGroupCommand } from '../../models';

@Injectable()
export class OrganizationService extends HttpDataService<OrganizationModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/organizations" : "api/organizations";

    constructor(http: Http) { super(http); }

    /**
     * Удаляет организации и сотрудников
     * @param c
     */
    delete(c: NodeGroupCommand): Observable<any> {

        return this.http
            .post(`${this.url}/delete`, c)
            .catch(handleResponseError);    
    }


    /**
     * Поиск узлов дерева
     * @param emplsearch - поиск по сотрудникам
     * @param orgid      - id организации
     * @param filter     - фильтра
     */
    getAll(emplsearch:boolean, orgid?:number, filter?: string): Observable<any> {

        let params: URLSearchParams = new URLSearchParams();

        emplsearch && params.append("emplsearch", emplsearch.toString());
        orgid && params.append("orgid", orgid.toString());
        filter && params.append("filter", filter);

        return this.http
            .get(this.url, { params: params })
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}