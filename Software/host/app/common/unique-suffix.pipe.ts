import { Pipe, PipeTransform } from '@angular/core';

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