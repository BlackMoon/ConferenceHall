import { MemberModel, TimeRange } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Активная конференция (на отдельном экране)
 */
export class ScreenModel {
    
    schemeId: string;
    startDate: Date;
    endDate: Date;
    subject: string;

    @JsonProperty({ clazz: MemberModel })
    members: MemberModel[];
    tickers: string[];

    constructor() {
        
        this.members = null;
        this.schemeId = null;
        this.startDate = null;
        this.endDate = null;
        this.subject = null;
        this.tickers = null;
    }
}