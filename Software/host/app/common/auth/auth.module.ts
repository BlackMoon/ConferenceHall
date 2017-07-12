import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { ButtonModule, InputTextModule, PasswordModule } from 'primeng/primeng';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthGuard } from './auth.guard';
import { AuthService, Storage, TokenKey } from './auth.service';
import { LoginComponent } from "./login.component";

let authHttpServiceFactory = (authService: AuthService, http: Http, options: RequestOptions) => {

    return new AuthHttp(new AuthConfig({
        tokenName: TokenKey,
        tokenGetter: (() => authService.isAuthenticated ? Storage.getItem(TokenKey) : authService.login().toPromise())
    }), http, options);
}

@NgModule({
    declarations: [LoginComponent],    
    exports: [LoginComponent],
    imports: [ButtonModule, CommonModule, FormsModule, HttpModule, InputTextModule, PasswordModule, ReactiveFormsModule]    
})
export class AuthModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AuthGuard,
                {
                    provide: AuthHttp,
                    useFactory: authHttpServiceFactory,
                    deps: [AuthService, Http, RequestOptions]
                },
                AuthService
            ]
        }
    }
}