import { isDevMode } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

/**
 * Функция получения ошибки из http.Response
 * @param error
 */
export function handleResponseError(error: Response | any): ErrorObservable {
   
    let errMsg: string;
    if (error instanceof Response)
    {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    else 
        errMsg = error.message ? error.message : error.toString();
    
    isDevMode() && console.error(errMsg);
    return Observable.throw(errMsg);
}