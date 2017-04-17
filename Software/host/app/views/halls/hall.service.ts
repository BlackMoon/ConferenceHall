import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { HallModel } from '../../models/index';

const url = "/api/halls";

@Injectable()
export class HallService {

    constructor(private http: Http) {}

    get(): Observable<any> {

        return this.http
            .get(url)
            .map((r: Response) => r.json());

    }
}