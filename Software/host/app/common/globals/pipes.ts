import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
/**
 * Форматирование dateTime pipe (реализация через moment.js)
 */
@Pipe({
    name: "datex"
})
export class DatexPipe implements PipeTransform {
    transform(value: any, format: string = ""): string {
        // Try and parse the passed value.
        let momentDate = moment(value);
        // If moment didn't understand the value, return it unformatted.
        if (!momentDate.isValid())
            return value;
        // Otherwise, return the date formatted as requested.
        return momentDate.format(format);
    }
}

/**
 * Переводит dateTime в utc
 */
@Pipe({
    name: "utc"
})
export class DateToUtcPipe implements PipeTransform {
    transform(value: Date): Date {
        return new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    }
}


/**
 * Прибавляет к строке уникальный суффикс
 */
@Pipe({
    name: "uniquesuffix"
})
export class UniqueSuffixPipe implements PipeTransform {
    transform(value: string): string {
        return `${value}?${new Date().getTime()}`;
    }
}