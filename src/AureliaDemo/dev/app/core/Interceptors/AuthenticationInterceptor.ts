import { inject } from 'aurelia-framework';
import { LocalStorageProvider } from 'providers/LocalStorageProvider';
import { RequestMessage } from 'aurelia-http-client';

@inject(LocalStorageProvider)
export class AuthenticationInterceptor {
    localStorageProvider: LocalStorageProvider;

    constructor(localStorageProvider: LocalStorageProvider) {
        this.localStorageProvider = localStorageProvider;
    }

    request(message: RequestMessage) {
        
    }

    requestError(error) {
        
    }
}