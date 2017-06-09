import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { OrganizationModel } from '../../models';

@Injectable()
export class OrganizationService extends HttpDataService<OrganizationModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/organizations" : "api/organizations";

    constructor(http: Http) { super(http); }

    getAll(orgid?:number, filter?: string): Observable<any> {

        let params: URLSearchParams = new URLSearchParams();
        orgid && params.append("orgid", orgid.toString());
        filter && params.append("filter", filter);

        return this.http
            .get(this.url, { params: params })
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}