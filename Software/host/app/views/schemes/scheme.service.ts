import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { HttpDataService } from '../../common/data-service';
import { SchemeModel } from '../../models';


@Injectable()
export class SchemeService extends HttpDataService<SchemeModel> {
    
    url = isDevMode() ? "http://localhost:64346/api/schemes" : "/api/schemes";

    constructor(http: Http) { super(http); }
}