import { Component} from '@angular/core';
import { HallService } from './hall.service';

@Component({
    template: `details`
})
export class HallDetailComponent{
    constructor(private hallService: HallService) {}
}