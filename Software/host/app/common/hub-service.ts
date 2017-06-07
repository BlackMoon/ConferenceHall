import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from "rxjs/Subject";
import { MemberModel } from "../models";

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
    confirmMember(memberId: number);
    sendTickers(tickers: string[]);
}

/**
 * signalR служба
 */
@Injectable()
export class HubService {
    currentState = SignalRConnectionStatus.Disconnected;
    connectionState: Observable<SignalRConnectionStatus>;

    confirmMember: Observable<MemberModel>;
    sendTickers: Observable<string[]>;

    private connectionStateSubject = new Subject<SignalRConnectionStatus>();

    private confirmMemberSubject = new Subject<MemberModel>();
    private sendTickersSubject = new Subject<string[]>();

    constructor() {

        this.connectionState = this.connectionStateSubject.asObservable();

        this.confirmMember = this.confirmMemberSubject.asObservable();
        this.sendTickers = this.sendTickersSubject.asObservable();
    }

    private setConnectionState(connectionState: SignalRConnectionStatus) {
        console.log(`connection state changed to: ${connectionState}`);

        this.currentState = connectionState;
        this.connectionStateSubject.next(connectionState);
        this.connectionStateSubject.complete();
    }

    /**
     * server's confirmMember method
     * @param id
     */
    private onConfirmMember(member) {
        this.confirmMemberSubject.next(member);
    }

    /**
     * server's sendTickets method
     * @param tickers
     */
    private onSendTickers(tickers) {
        this.sendTickersSubject.next(tickers);
    }

    start(key): Observable<SignalRConnectionStatus> {

        $.connection.hub.logging = isDevMode();
        $.connection.hub.qs = `id=${key}`;

        // reference signalR hub named 'broadcaster'
        let proxy = $.connection.broadcaster;
        if (proxy) {
            let client = <IHubClient>proxy.client;
           
            client.confirmMember = member => this.onConfirmMember(member);
            client.sendTickers = tickers => this.onSendTickers(tickers);

            // start the connection
            $.connection
                .hub
                .start()
                .done(_ => this.setConnectionState(SignalRConnectionStatus.Connected))
                .fail(error => this.connectionStateSubject.error(error));
        }
        else
            console.warn("broadcaster proxy not available");

        return this.connectionState;
    }
}