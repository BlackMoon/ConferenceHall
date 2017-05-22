import { ISelected, KeyModel } from './index';

export const confDragType = "conference";

/**
 * Модель. Конференция
 */
export class ConferenceModel extends KeyModel implements ISelected {

    selected: boolean;

    constructor() {
        super();
    }
}