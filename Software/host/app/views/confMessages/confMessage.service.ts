import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ConfMessageModel } from '../../models';

@Injectable()
export class ConfMessageService extends HttpDataService<ConfMessageModel> {
    
    url = isDevMode() ? "http://localhost:64346/api/confMessages" : "/api/confMessages";

    constructor(http: Http) { super(http); }

}