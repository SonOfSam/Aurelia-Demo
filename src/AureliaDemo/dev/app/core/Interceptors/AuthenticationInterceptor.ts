import { inject } from 'aurelia-framework';
import { AuthenticationProvider } from "core/CoreProviders"
import { RequestMessage } from 'aurelia-http-client';

@inject(AuthenticationProvider)
export class AuthenticationInterceptor {
    authProvider: AuthenticationProvider;    
    
    constructor(localStorageProvider: AuthenticationProvider) {
        this.authProvider = localStorageProvider;        
    }

    responseError(error) {
        console.log('AuthenticationInterceptor => Error', error);
    }
}