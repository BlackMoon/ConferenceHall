import { ISelected, KeyModel } from './index';

export const confDragType = "conference";

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
    selected: boolean;
    state: ConfState;
    subject: string;

    constructor() {
        super();

        this.description = null;
        this.state = ConfState.Planned;
        this.subject = null;
    }
}