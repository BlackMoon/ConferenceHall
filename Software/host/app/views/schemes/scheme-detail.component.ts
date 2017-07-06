import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Storage } from "../../common/storage";

@Component({
    host: { '(window:popstate)': "onPopState($event)" },
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
    referrer: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storage: Storage) {
       
        this.referrer = storage.previousRoute || document.referrer;
    }

    ngOnInit() {

        this.route.params
            .subscribe((params: Params) => {
                // (+) converts string 'id' to a number
                this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
            });
    }

    onPopState(e) {
        setTimeout(() => this.router.navigateByUrl(this.referrer), 0);
    }
    
}