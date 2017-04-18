import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthService, Storage, TokenKey } from './auth.service';

let authHttpServiceFactory = (authService: AuthService, http: Http, options: RequestOptions) => {

    return new AuthHttp(new AuthConfig({
        tokenName: TokenKey,
        tokenGetter: (() => authService.isAuthenticated ? Storage.getItem(TokenKey) : authService.login().toPromise()),
        globalHeaders: [{ 'Content-Type': 'application/json' }, { 'Access-Control - Allow - Origin': '*'}]
    }), http, options);
}

@NgModule({
    declarations: [],    
    exports: [],
    imports: [HttpModule]    
})
export class AuthModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
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