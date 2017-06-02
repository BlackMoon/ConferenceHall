﻿import { ISelected, KeyModel, TimeRange } from './index';
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
 * Модель. Конференция
 */
export class ConferenceModel extends KeyModel implements ISelected {
    
    description: string;
    hallId?: number;
    startDate?: Date;
    endDate?: Date;
    
    selected: boolean;
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
    }
}

/**
 * Модель. Назначение конференции
 */
export class AppointmentModel {

    /**
     * длительность в формате HH:mm:ss
     */
    duration: string;

    start: Date;

    hallId: number;

    /**
     * id конференции
     */
    conferenceId: number;
}
