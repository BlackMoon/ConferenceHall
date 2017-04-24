/**
 * Кнопка
 */
export class ButtonItem {
    id: string;
    name?: string;
    icon?: string;
    iconUrl?: string;
    visible?: boolean = true;
    click?: (e) => void;
}