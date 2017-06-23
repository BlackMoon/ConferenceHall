import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { AppointmentModel, ConferenceModel, ConfState, FindConferencesQuery, TimeRange } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ConferenceService extends HttpDataService<ConferenceModel> {

    url = isDevMode() ? "http://localhost:64346/api/conferences" : "api/conferences";

    constructor(http: Http) { super(http); }    

    /**
     * Изменить период
     * @param id
     * @param start
     * @param end
     */
    changePeriod(id: number, start, end): Observable<any> {

        let body = [{ op: 'replace', path: '/startdate', value: start }, { op: 'replace', path: '/enddate', value: end }];

        return this.http
            .patch(`${this.url}/${id}`, body)
            .catch(handleResponseError);
    }

    /**
     * Изменить состояние
     * @param id
     * @param state
     */
    changeState(id: number, state: ConfState): Observable<any> {

        let body = [{op: 'replace', path: '/state', value: state }];

        return this.http
            .patch(`${this.url}/${id}`, body)
            .catch(handleResponseError);    
    }

    get(key) {
        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => MapUtils.deserialize(ConferenceModel, r.json()))
            .catch(handleResponseError);
    }

    getAll(startDate: Date, endDate: Date, state: ConfState = null, hallIds: number[] = null, employeeIds: number[] = null, organizationIds: number[] = null): Observable<any> {

        let body: FindConferencesQuery = { startDate: startDate, endDate: endDate, state: state };

        hallIds && hallIds.length > 0 && (body.hallIds = hallIds);
        employeeIds && employeeIds.length > 0 && (body.employeeIds = employeeIds);
        organizationIds && organizationIds.length > 0 && (body.organizationIds = organizationIds);

        return this.http
            .post(`${this.url}/search`, body)
            .map((r: Response) => r
                .json()
                .map(conf => MapUtils.deserialize(ConferenceModel, conf))
            )
            .catch(handleResponseError);
    }

    /**
     * Назначить совещание
     * @param a
     */
    makeAppointment(a: AppointmentModel) : Observable<any> {

        return this.http
            .put(`${this.url}/appointment`, a)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}