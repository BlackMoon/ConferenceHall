import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "../../common/logger";

@Component({
    template: "conference details"
})
export class ConferenceDetailComponent {

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {

        this.route.params
            .subscribe((params: Params) => {
                // (+) converts string 'id' to a number
                console.log(params["id"]);
                //this.id = params.hasOwnProperty("id") ? +params["id"] : undefined;
            });
    }
}