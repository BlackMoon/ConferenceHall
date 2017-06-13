import { NgModule } from '@angular/core';
import { UniqueSuffixPipe } from './/pipes';

@NgModule({
    declarations: [UniqueSuffixPipe],
    exports: [UniqueSuffixPipe]
    
})
export class GlobalsModule { }