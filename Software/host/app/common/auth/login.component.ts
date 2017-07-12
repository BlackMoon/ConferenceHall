import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Logger } from "../logger";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "app-login",
    styles: [ ".login-panel { margin-top: 5em }"],
    templateUrl: "login.component.html"
})
export class LoginComponent {
    
    loginForm: any;
    returnUrl: string;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private logger: Logger,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.loginForm = this.fb.group({
            login: [null, Validators.required],
            password: [null, Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    authenticate(e, user) {

        e.preventDefault();

        this.authService
            .login(user.login, user.password)
            .subscribe(
                _ => this.router.navigateByUrl(this.returnUrl),
                error => this.logger.error2(error)
            );
    }

}