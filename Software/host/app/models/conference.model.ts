import { KeyModel } from './index';
import { JsonProperty } from '../common/map-utils';

/**
 * Состояние конференции
 */
export enum ConfState { Planned, Preparing, Active, Closed }

export namespace ConfState {
    export function toName(state: ConfState) {

        let name: string = "";
        switch (state) {

            case ConfState.Planned:
                name = "Планируемые";
                break;

            case ConfState.Preparing:
                name = "На подготовке";
                break;

            case ConfState.Active:
                name = "Активные";
                break;

            case ConfState.Closed:
                name = "Завершенные";
                break;
        }

        return name;
    }
}

/**
 * Запрос поиска конференций
 */
export class FindConferencesQuery {
    state?: ConfState;
    startDate?: Date;
    endDate?: Date;
    hallIds?: number[];
    employeeIds?: number[];
    organizationIds?: number[];
}


/**
 * Модель. Конференция
 */
export class ConferenceModel extends KeyModel {
    
    description: string;
    hallId?: number;
    schemeId?: number;
   
    startDate?: Date;
    endDate?: Date;

    state: ConfState;
    subject: string;

    constructor() {
        super();
        
        this.description = null;
        this.hallId = null;
        this.startDate = null;
        this.endDate = null;
        this.state = ConfState.Planned;
        this.subject = null;
        this.schemeId = null;
    }
}

/**
 * Модель. Назначение конференции
 */
export class AppointmentModel {

    conferenceId: number;

    /**
     * длительность в формате HH:mm:ss
     */
    duration: string;

    start: Date;

    hallId: number;
}
