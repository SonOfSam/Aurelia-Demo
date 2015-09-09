import { inject } from 'aurelia-framework';
import { AuthenticationProvider } from "core/CoreProviders"
import { RequestMessage, HttpClient } from 'aurelia-http-client';
import { Router } from 'aurelia-router'

@inject(AuthenticationProvider, Router, HttpClient)
export class AuthenticationInterceptor {
    authProvider: AuthenticationProvider;
    router: Router = null;
    httpClient: HttpClient = null;
    
    constructor(authenticationProvider: AuthenticationProvider, router: Router, httpClient: HttpClient) {
        this.authProvider = authenticationProvider;
        this.router = router;
        this.httpClient = httpClient;
    }

    responseError(error) {
        console.log('AuthenticationInterceptor => Error', error); 

        if (error.statusCode === 401) {
            return new Promise((resolve, reject) => {
                this.authProvider.refreshToken().then(result => {
                    if (result.success) {
                        this.retryHttpRequest(error.requestMessage, { resolve: resolve, reject: reject });
                    } else {
                        this.authProvider.logout().then(() => {
                            this.router.navigate('login');
                            reject("auth failed");
                        });
                    }
                }).catch(() => {
                    this.authProvider.logout().then(() => {
                        this.router.navigate('login');
                        reject("auth failed");
                    });
                });
            });            
        }               
    }

    retryHttpRequest(requestMessage, defer) : void {
        console.log('retyHttpRequest => requestMessage', requestMessage);

        this.httpClient.send(requestMessage, null).then(response => {
            defer.resolve(response);
        }).catch(error => {
            defer.reject(error);
        });
    }
}