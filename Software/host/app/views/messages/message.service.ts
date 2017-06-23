﻿import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { GroupCommand, MessageModel } from '../../models';

@Injectable()
export class MessageService extends HttpDataService<MessageModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/messages" : "api/messages";

    constructor(http: Http) { super(http); }


    /**
     * Изменить соcтояние сообщения
     * @param messageId
     * @param active
     */
    changeActive(messageId, active): Observable<any> {

        let body = [{ op: 'replace', path: '/active', value: active }];

        return this.http
            .patch(`${this.url}/${messageId}`, body)
            .catch(handleResponseError);
    }

    /**
     * Изменить содержимое сообщения
     * @param messageId
     * @param content
     */
    changeContent(messageId, content) : Observable<any> {

        let body = [{ op: 'replace', path: '/content', value: content }];

        return this.http
            .patch(`${this.url}/${messageId}`, body)
            .catch(handleResponseError);
    }

    /**
     * Удаляет сообщения
     * @param c
     */
    delete(c: GroupCommand): Observable<any> {

        return this.http
            .post(`${this.url}/delete`, c)
            .catch(handleResponseError);
    }

    getAll(confid: number) : Observable<any> {
        
        return this.http
            .get(`${this.url}/${confid}`)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}