import { Pipe, PipeTransform } from '@angular/core';

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