import { NgModule } from '@angular/core';
import { UniqueSuffixPipe } from './pipes';

/**
 * Randimize int (for new created dataKey)
 * @param min
 * @param max
 */
export function rand(min:number = 1, max = 1e6) {

    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

@NgModule({
    declarations: [UniqueSuffixPipe],
    exports: [UniqueSuffixPipe]
    
})
export class GlobalsModule { }