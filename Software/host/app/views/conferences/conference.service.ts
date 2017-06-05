import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { AppointmentModel, ConferenceModel, ConfState, FindQuery, TimeRange } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ConferenceService extends HttpDataService<ConferenceModel> {

    url = isDevMode() ? "http://localhost:64346/api/conferences" : "api/conferences";

    constructor(http: Http) { super(http); }

    getAll(startDate: Date, endDate: Date, state: ConfState = null, hallIds: number[] = null): Observable<any> {

        let body: FindQuery = { startDate: startDate, endDate: endDate, state: state};

        hallIds && hallIds.length > 0 && (body.hallIds = hallIds); 

        return this.http
            .post("/api/search", body)
            .map((r: Response) => r
                .json()
                .map(conf => MapUtils.deserialize(ConferenceModel, conf))
            )
            .catch(handleResponseError);
    }

    /**
     * Изменить период
     * @param confid
     * @param start
     * @param end
     */
    changePeriod(confid: number, start, end): Observable<any> {

        let body = [{ op: 'replace', path: '/startdate', value: start }, { op: 'replace', path: '/enddate', value: end }];

        return this.http
            .patch(`${this.url}/${confid}`, body)
            .catch(handleResponseError);
    }

    /**
     * Изменить состояние
     * @param confid
     * @param state
     */
    changeState(confid: number, state: ConfState): Observable<any> {

        let body = [{op: 'replace', path: '/state', value: state }];

        return this.http
            .patch(`${this.url}/${confid}`, body)
            .catch(handleResponseError);    
    }

    /**
     * Назначить совещание
     * @param a
     */
    makeAppointment(confid: number, a: AppointmentModel) : Observable<any> {

        return this.http
            .put(`/api/appointment/${confid}`, a)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}