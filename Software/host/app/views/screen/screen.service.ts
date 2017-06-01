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

/**
 * Интерфейс broadcast hub'а
 */
interface IHubClient {
    sendTickers(tickers: string[]); 
}

@Injectable()
export class ScreenService extends HttpDataService<ScreenModel> {
    
    currentState = SignalRConnectionStatus.Disconnected;
    connectionState: Observable<SignalRConnectionStatus>;

    sendTickers: Observable<string[]>;

    private connectionStateSubject = new Subject<SignalRConnectionStatus>();
    
    private sendTickersSubject = new Subject<string[]>();

    url = isDevMode() ? "http://localhost:64346/api/screen" : "/api/screen";

    constructor(http: Http) {
        super(http);

        this.connectionState = this.connectionStateSubject.asObservable();
        
        this.sendTickers = this.sendTickersSubject.asObservable();
    }

    private setConnectionState(connectionState: SignalRConnectionStatus) {
        console.log(`connection state changed to: ${connectionState}`);

        this.currentState = connectionState;
        this.connectionStateSubject.next(connectionState);
        this.connectionStateSubject.complete();
    }
   
    /**
     * server's sendTickets method
     * @param tickers
     */
    private onSendTickers(tickers) {
        this.sendTickersSubject.next(tickers);
    }

    get(key): Observable<ScreenModel> {

        return this.http
            .get(`${this.url}/${key}`)
            .map((r: Response) => {
                debugger;
                return MapUtils.deserialize(ScreenModel, r.json());
            })
            .catch(handleResponseError);
    }

    start(key): Observable<SignalRConnectionStatus> {

        $.connection.hub.logging = isDevMode();
        $.connection.hub.qs = `id=${key}`;

        // reference signalR hub named 'broadcaster'
        let proxy = $.connection.broadcaster,
            client = <IHubClient>proxy.client;

        //client.method2 = tickers => this.onMethod2(tickers);
        client.sendTickers = tickers => this.onSendTickers(tickers);

        // start the connection
        $.connection
            .hub
            .start()
            .done(_ => this.setConnectionState(SignalRConnectionStatus.Connected))
            .fail(error => this.connectionStateSubject.error(error));

        return this.connectionState;

        //return Observable.of(SignalRConnectionStatus.Connected);
    }
}