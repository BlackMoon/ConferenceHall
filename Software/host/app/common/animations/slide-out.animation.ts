import { trigger, state, animate, transition, style } from '@angular/animations';

export const slideOutAnimation =
    trigger('slideOutAnimation', [

        state('in', style({ transform: 'translateX(0%)' })),
        state('out', style({ transform: 'translateX(100%)' })),

        transition('in => out', animate('1000ms ease-out')),
        transition('out => in', animate('1000ms ease-in'))
    ]);