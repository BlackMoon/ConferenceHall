import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Logger } from "../logger";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "app-login",
    styles: ["#layout-content { background-color: #607D8B; }", ".login-panel { margin-top: 5em }"],
    templateUrl: "login.component.html"
})
export class LoginComponent {
    
    loginForm: any;

    constructor(
        private authService: AuthService,
        private logger: Logger,
        private fb: FormBuilder) { }

    ngOnInit() {

        this.loginForm = this.fb.group({
            login: [null, Validators.required],
            password: [null, Validators.required]
        });
    }

    authenticate(e, user) {

        e.preventDefault();

        this.authService
            .login(user.login, user.password)
            .subscribe(
                __ => {},
                error => this.logger.error2(error)
            );
    }

}