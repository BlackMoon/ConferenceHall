import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { AppointmentModel, ConferenceModel, ConfState } from '../../models';

import MapUtils from '../../common/map-utils';

@Injectable()
export class ConferenceService extends HttpDataService<ConferenceModel> {

    url = isDevMode() ? "http://localhost:64346/api/conferences" : "/api/conferences";

    constructor(http: Http) { super(http); }

    getAll(startDate: Date, endDate: Date, state: ConfState = null): Observable<any> {

        let queryParams = [];

        if (state !== null)
            queryParams.push(`state=${state}`);

        // [активные, на подготовке, завершенные] совещания фильтруются по дате
        if (state !== ConfState.Planned) {
            queryParams.push(`startDate=${startDate.getMonth() + 1}.${startDate.getDate()}.${startDate.getFullYear()}`);
            queryParams.push(`endDate=${endDate.getMonth() + 1}.${endDate.getDate()}.${endDate.getFullYear()}`);
        }    

        return this.http
            .get(`${this.url}?${queryParams.join("&")}`)
            .map((r: Response) => r
                .json()
                .map(conf => MapUtils.deserialize(ConferenceModel, conf))
            )
            .catch(handleResponseError);
    }

    changePeriod(id, start: Date, delta) : Observable<any> {

        let body = [
            { op: "replace", path: "/start", value: start },
            { op: "replace", path: "/delta", value: delta }
        ];

        return this.http
            .patch(`/api/period/${id}`, body)
            .catch(handleResponseError);
    }

    makeAppointment(a: AppointmentModel) : Observable<any> {

        return this.http
            .post('/api/appointment', a)
            .map((r: Response) => r.json())
            .catch(handleResponseError);
    }
}