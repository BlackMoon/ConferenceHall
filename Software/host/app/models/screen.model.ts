import { KeyModel } from './index';

/**
 * Модель. Активная конференция (на отдельном экране)
 */
export class ScreenModel extends KeyModel{
    
    schemeId: string;
    startDate: Date;
    endDate: Date;
    subject: string;
    
    tickers: string[];

    constructor() {

        super();

        this.schemeId = null;
        this.startDate = null;
        this.endDate = null;
        this.subject = null;
        this.tickers = null;
    }
}