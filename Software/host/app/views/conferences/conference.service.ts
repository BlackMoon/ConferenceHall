import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { AppointmentModel, ConferenceModel, ConfState, TimeRange } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ConferenceService extends HttpDataService<ConferenceModel> {

    url = isDevMode() ? "http://localhost:64346/api/conferences" : "api/conferences";

    constructor(http: Http) { super(http); }

    getAll(startDate: Date, endDate: Date, state: ConfState = null, hallIds: number[] = []): Observable<any> {
        
        let params: URLSearchParams = new URLSearchParams();
        if (state !== null)
            params.append("state", `${state}`);

        // [активные, на подготовке, завершенные] совещания фильтруются по дате
        if (state !== ConfState.Planned) {
            params.append("startDate", `${startDate.getMonth() + 1}.${startDate.getDate()}.${startDate.getFullYear()}`);
            params.append("endDate", `${endDate.getMonth() + 1}.${endDate.getDate()}.${endDate.getFullYear()}`);
        }
        debugger;
        hallIds.forEach(id => params.set("hallids", id.toString()));

        return this.http
            .get(this.url, { params: params })
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

        return this.http
            .put(`/api/period/${confid}`, { start: start, end: end })
            .catch(handleResponseError);
    }

    /**
     * Изменить состояние
     * @param confid
     * @param state
     */
    changeState(confid: number, state: ConfState): Observable<any> {

        return this.http
            .put(`/api/state/${confid}`, { state: state })
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