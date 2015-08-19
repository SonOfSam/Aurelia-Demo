import { inject } from 'aurelia-framework';
import { RequestBuilder, HttpClient } from 'aurelia-http-client';
import { Router } from 'aurelia-router'
import { AuthenticationProvider } from 'core/CoreProviders'
import { AuthenticationInterceptor } from 'core/CoreInterceptors'

@inject(AuthenticationProvider, Router, HttpClient)
export class HttpClientExtensions {
    requestBuilder = null;
    authenticationProvider: AuthenticationProvider = null;
    router: Router = null;
    httpClient: HttpClient = null;

    constructor(authenticationProvider: AuthenticationProvider, router: Router, httpClient: HttpClient) {        
        this.authenticationProvider = authenticationProvider;
        this.router = router;
        this.httpClient = httpClient;
    }

    configure() {        
        var withToken = (internalAuth = true, identifier = undefined) => {
            return (client, processor, message) => {
                let token = (internalAuth ? this.getToken() : this.getCustomToken(identifier));

                if (internalAuth) {
                    message.interceptors = message.interceptors || [];
                    message.interceptors.unshift(new AuthenticationInterceptor(this.authenticationProvider, this.router, this.httpClient));
                }

                message.headers.add('Authorization', token);       
            };
        }
        RequestBuilder.addHelper('withToken', withToken);
    }

    getToken(): string {        
        return this.authenticationProvider.getToken();
    }

    getCustomToken(identifier: string): string {
        return 'Throw new NotImplementedException();';
    }
}