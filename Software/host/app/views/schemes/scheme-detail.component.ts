import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    template: `
        <div class="ui-g h100p">
            <div class="ui-g-2 ui-md-2 ui-widget-content ui-g-nopad">
                <scheme-toolbox></scheme-toolbox>
            </div>
            <div class="ui-g-10 ui-md-10 ui-widget-content ui-g-nopad">
                <scheme-main [schemeId]="id" [readOnly]="false"></scheme-main>
            </div>
        </div>`
})
export class SchemeDetailComponent implements OnInit {

    id: number;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {

        this.route.params
            .subscribe((params: Params) => {
                // (+) converts string 'id' to a number
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
            });
    }
    
}