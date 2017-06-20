import { KeyModel, MemberModel, TimeRange } from './index';
import { JsonProperty } from '../common/map-utils';

export const confDragType = "conference";

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

    confState: ConfState;
    description: string;
    hallId?: number;
    schemeId?: number;
   
    startDate?: Date;
    endDate?: Date;
   
    subject: string;

    @JsonProperty({ clazz: MemberModel })
    members?: MemberModel[];

    constructor() {
        super();

        this.confState = ConfState.Planned;
        this.description = null;
        this.hallId = null;
        this.startDate = null;
        this.endDate = null;
        this.subject = null;
        this.schemeId = null;

        this.members = undefined;
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
