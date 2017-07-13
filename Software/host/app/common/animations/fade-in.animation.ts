import { trigger, state, animate, transition, style } from '@angular/animations';

export const fadeInAnimation =
    trigger('fadeInAnimation', [

        state('hide', style({ opacity: 0 })),
        state('show', style({ opacity: 1 })),
        transition('hide => show', animate('2000ms ease-out')),
        transition('show => hide', animate('1000ms ease-in'))
    ]);