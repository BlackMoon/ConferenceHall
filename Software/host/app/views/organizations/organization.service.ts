import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { HttpDataService } from '../../common/data-service';
import { OrganizationModel } from '../../models';

@Injectable()
export class OrganizationService extends HttpDataService<OrganizationModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/organizations" : "api/organizations";

    constructor(http: Http) { super(http); }
}