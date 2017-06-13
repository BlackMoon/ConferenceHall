import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from "../../common/logger";
import { OrganizationService } from "./organization.service";


@Component({
    templateUrl: "organization-detail.component.html"
})
export class OrganizationDetailComponent implements OnInit {
    
    ngOnInit() {
        
    }
    
}