import { TimeRange } from './index';

/**
 * Модель. Активная конференция (на отдельном экране)
 */
export class ScreenModel {
    height: number;
    width: number;

    subject: string;
    plan: string;
    period: TimeRange;

    members: any[];
    messages: string[];

    constructor() {

        this.subject = null;
        this.plan = null;
        this.period = null;
        this.height = 2;
        this.width = 2;
    }
}