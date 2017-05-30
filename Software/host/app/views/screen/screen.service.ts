import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from "rxjs/Subject";
import { handleResponseError } from '../../common/http-error';
import { HttpDataService } from '../../common/data-service';
import { ScreenModel, TickerModel } from '../../models';

import MapUtils from '../../common/map-utils';

declare var $: any;

enum SignalRConnectionStatus {
    Connected = 1,
    Disconnected = 2,
    Error = 3
}

@Injectable()
export class ScreenService extends HttpDataService<ScreenModel> {

    sendTicker: Observable<string[]>;

    currentState = SignalRConnectionStatus.Disconnected;
    connectionState: Observable<SignalRConnectionStatus>;

    private sendTickerSubject = new Subject<string []>();
    private connectionStateSubject = new Subject<SignalRConnectionStatus>();

    url = isDevMode() ? "http://localhost:64346/api/screen" : "/api/screen";

    constructor(http: Http) {
        super(http);

        this.sendTicker = this.sendTickerSubject.asObservable();
    }

    private setConnectionState(connectionState: SignalRConnectionStatus) {
        console.log('connection state changed to: ' + connectionState);
        this.currentState = connectionState;
        this.connectionStateSubject.next(connectionState);
    }

    private onAddTickerMessage(messages) {
        this.sendTickerSubject.next(messages);
    }

    start(): Observable<SignalRConnectionStatus> {

        $.connection.hub.logging = isDevMode();
        debugger;

        let broadcaster = $.connection.broadcaster,
            client = broadcaster.client;

        client.sendTickerMessage = message => this.onAddTickerMessage(message);

        // start the connection
        $.connection.hub
            .start()
            .done(_ => this.setConnectionState(SignalRConnectionStatus.Connected))
            .fail(error => this.connectionStateSubject.error(error));

        return this.connectionState;
    }
}