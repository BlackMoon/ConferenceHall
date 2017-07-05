import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/http-data.service';
import { ContactModel } from '../../models';

@Injectable()
export class ContactService extends HttpDataService<ContactModel> {

    url: string = isDevMode() ? "http://localhost:64346/api/contacts" : "api/contacts";

    constructor(http: Http) { super(http); }    

    /**
    * Изменить соcтояние контакта
    * @param id
    * @param active
    */
    changeActive(id, active): Observable<any> {

        let body = [{ op: 'replace', path: '/active', value: active }];

        return this.http
            .patch(`${this.url}/${id}`, body)
            .catch(handleResponseError);
    }

    /**
    * Изменить адрес контакта
    * @param id
    * @param active
    */
    changeAddress(id, address): Observable<any> {

        let body = [{ op: 'replace', path: '/address', value: address }];

        return this.http
            .patch(`${this.url}/${id}`, body)
            .catch(handleResponseError);
    }

    /**
     * Изменить вид контакта
     * @param id
     * @param kind
     */
    changeKind(id, kind): Observable<any> {

        let body = [{ op: 'replace', path: '/kind', value: kind }];

        return this.http
            .patch(`${this.url}/${id}`, body)
            .catch(handleResponseError);
    }

    /**
     * Удаляет контакты
     * @param c
     */
    delete(ids: number[]): Observable<any> {

        let c = { ids: ids };

        return this.http
            .post(`${this.url}/delete`, c)
            .catch(handleResponseError);
    }    

    getSenders(): Observable<any> {

        return this.http
            .get(`${this.url}/senders`)
            .map((r: Response) => r.json())
            .catch(handleResponseError);    
    }
}