import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { MessageModel } from '../../models';

@Injectable()
export class MessageService extends HttpDataService<MessageModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/messages" : "api/messages";

    constructor(http: Http) { super(http); }

    getAll(confid: number) : Observable<any> {
        
        return this.http
            .get(`${this.url}/${confid}`)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}