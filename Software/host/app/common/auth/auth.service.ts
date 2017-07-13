// ReSharper disable InconsistentNaming
import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { handleResponseError } from '../http-error';
import { SysUserModel } from '../../models/index';
import * as CryptoJS from 'crypto-js';

const passwordKey = 'pswd';
const usernameKey = 'uname';

/**
 * .net ClaimNames --> UserModel fields mapping
 */
class Claims implements Dict<string>
{
    'description' = null;
    'isadmin' = null;
    'username' = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

    [key: string]: string;
}

/**
 * .net Cryptography.PaddingMode --> CryptoJS.pads mapping
 */
class Pads implements Dict<any>
{
    'None' = CryptoJS.pad.NoPadding;
    'PKCS7' = CryptoJS.pad.Pkcs7;
    'Zeros' = CryptoJS.pad.ZeroPadding;
}

export const Storage = isDevMode ? localStorage : sessionStorage;
export const TokenKey = 'token';

/**
 * Служба аутентификации
 */
@Injectable()
export class AuthService {

    private jwtHelper: JwtHelper = new JwtHelper();

    private claims: Claims = new Claims();
    private pads: Pads = new Pads();

    private storage: Storage;

    private url: string = isDevMode() ? "http://localhost:64346" : "";
    
    constructor(private http: Http) {
                
        this.storage = Storage;
    }

    get isAuthenticated(): boolean {
        var token = this.storage.getItem(TokenKey);
        return (token !== null) && !this.jwtHelper.isTokenExpired(token);
    }

    get LoggedUser(): SysUserModel {
        var user: SysUserModel = new SysUserModel(),
            token = this.storage.getItem(TokenKey);

        if (token != null) {
            let obj = this.jwtHelper.decodeToken(token);

            for (let key in this.claims) {
                let value = this.claims[key] || key;
                user[key] = obj[value];
            }
        }

        return user;
    }    

    login(username?: string, password?: string): Observable<any> {

        // username & password store in base64
        let item;
        if (!username) {
            item = this.storage.getItem(usernameKey);
            item && (username = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8));
        }

        if (!password) {
            item = this.storage.getItem(passwordKey);
            item && (password = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8));
        }

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });  

        var self = this;
        return this.http.post(`${this.url}/secret`, `username=${username}`, options)
            .map((r: Response) => r.json())
            .mergeMap(o => {

                let cipher = CryptoJS[o.algorithm];

                if (cipher) {

                    let key = CryptoJS.enc.Base64.parse(o.key),
                        iv = CryptoJS.enc.Base64.parse(o.iv),
                        mode = CryptoJS.mode[o.mode],
                        pad = this.pads[o.padding],
                        encrypted = cipher.encrypt(password, key, { iv: iv, mode: mode, padding: pad });

                    return this.http
                        .post(`${this.url}/token`, `username=${username}&password=${encrypted}&key=${o.key}`, options)
                        .map((r: Response) => r.json())
                        .mergeMap(o => {
                            
                            if (o.access_token) {
                                self.storage.setItem(passwordKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password)));
                                self.storage.setItem(usernameKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(username)));
                                self.storage.setItem(TokenKey, o.access_token);
                            }
                            return Observable.of(o.access_token);
                        });
                }
                else
                    return Observable.throw('Unknown algorithm');                    
            })
            .catch(handleResponseError);
    }

    logout(): void {
        // clear token remove user from local storage to log user out        
        this.storage.removeItem(passwordKey);
        this.storage.removeItem(usernameKey);
        this.storage.removeItem(TokenKey);
    }
}