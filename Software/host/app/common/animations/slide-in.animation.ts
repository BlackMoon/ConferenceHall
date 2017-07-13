import { trigger, state, animate, transition, style } from '@angular/animations';

export const slideInAnimation =
    trigger('slideInAnimation', [

        state('in', style({ transform: 'translateX(0%)' })),
        state('out', style({ transform: 'translateX(-100%)' })),

        transition('in => out', animate('1000ms ease-in')),
        transition('out => in', animate('1000ms ease-out'))
    ]);