import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { TickerModel } from '../../models';

@Injectable()
export class TickerService extends HttpDataService<TickerModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/tickers" : "api/tickers";

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
     * @param ids
     */
    delete(ids: number[]): Observable<any> {

        let c = { ids: ids };

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

    /**
     * Отправить уведомления
     * @param text
     * @param ids - id сотрудников
     */
    notify(text, ids: number[]) : Observable<any> {

        let body = { ids: ids, body: text };

        return this.http
            .post(`${this.url}/send`, body)
            .catch(handleResponseError);
    }
}