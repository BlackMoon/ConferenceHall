import { Observable } from 'rxjs';

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

export interface IHttpDataService<T> extends IDataService<T> {

    url: string;
}