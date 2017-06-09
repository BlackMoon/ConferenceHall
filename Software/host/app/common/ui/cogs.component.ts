import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: "coqs",
    template: `<p-splitButton icon="fa-cogs" [model]="actions"></p-splitButton>`
})
export class CoqsComponent implements OnInit {

    @Input()
    actions: MenuItem[];

    ngOnInit() {
        this.actions = [
            {
                label: 'Update', icon: 'fa-refresh', command: () => {
                    
                }
            },
            {
                label: 'Delete', icon: 'fa-close', command: () => {
                   
                }
            },
            { label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io' },
            { label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming'] }
        ];
    }
}