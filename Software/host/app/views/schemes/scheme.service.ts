import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { SchemeModel } from '../../models';


@Injectable()
export class SchemeService extends HttpDataService<SchemeModel> {

    url = "/api/schemes";
    //url = "http://webtest.aquilon.ru:810/api/schemes";

    constructor(http: Http) { super(http); }
}