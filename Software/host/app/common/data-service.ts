import { Observable } from 'rxjs';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { handleResponseError } from './http-error';
import { KeyModel } from "../models/key.model";

/**
 * Интерфейс получения данных
 */
export interface IDataService<T> {

    add(entity: T): Observable<any>;

    delete(key: any): Observable<any>;

    getAll(...args: any[]): Observable<T[]>;

    get(key:any): Observable<T>;

    update(entity: T): Observable<any>;
    
}

/**
 * Служба получения данных по http-протоколу
 */
export abstract class HttpDataService<T extends KeyModel> implements IDataService<T> {

    protected url: string;

    constructor(protected http: Http) { }

    add(entity: T): Observable<any> {

        return this.http
            .post(this.url, entity)
            .catch(handleResponseError);
    }

    delete(key): Observable<any> {
        
        return this.http
            .delete(`${this.url}/${key}`)
            .catch(handleResponseError);
    }

    getAll(...args: any[]): Observable<T[]> {

        return this.http
            .get(this.url)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }

    get(key): Observable<T> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }

    update(entity: T): Observable<any> {

        return this.http
            .put(`${this.url}/${entity.id}`, entity)
            .catch(handleResponseError); }

    
}