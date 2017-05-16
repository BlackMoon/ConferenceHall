import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ConferenceModel } from '../../models';

@Injectable()
export class ConferenceService extends HttpDataService<ConferenceModel> {

    url = isDevMode() ? "http://localhost:64346/api/conferences" : "/api/conferences";

    constructor(http: Http) { super(http); }
}