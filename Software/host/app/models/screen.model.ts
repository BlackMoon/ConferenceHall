import { MemberModel, TimeRange } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Модель. Активная конференция (на отдельном экране)
 */
export class ScreenModel {
    
    plan: string;
    period: TimeRange;
    subject: string;

    height: number;
    width: number;

    @JsonProperty({ clazz: MemberModel })
    members: MemberModel[];
    tickers: string[];

    constructor() {
        
        this.members = null;
        this.plan = null;
        this.period = null;
        this.subject = null;
        this.tickers = null;
        this.height = 2;
        this.width = 2;
    }
}