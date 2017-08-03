import { ConfState, KeyModel } from './index';

/**
 * Модель. Активная конференция (на отдельном экране)
 */
export class ScreenModel extends KeyModel {
    
    schemeId: string;
    startDate: Date;
    endDate: Date;
    state: ConfState;
    subject: string;
    
    tickers: string[];

    constructor() {

        super();

        this.schemeId = null;
        this.startDate = null;
        this.endDate = null;

        this.state = ConfState.Planned;
        this.subject = null;
        this.tickers = null;
    }
}

/**
 * Оратор
 */
export class SpeakerModel {

    summary: string;
    details: string;
}