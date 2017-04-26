/**
 * Кнопка
 */
export class ButtonItem {
    id: string;
    name?: string;
    icon?: string;
    iconUrl?: string;
    tooltip?: string;
    visible?: boolean = true;
    click?: (e) => void;
}