import { inject } from 'aurelia-framework';
import { RequestBuilder } from 'aurelia-http-client';
import { AuthenticationProvider } from 'core/CoreProviders'
import { AuthenticationInterceptor } from 'core/CoreInterceptors'

@inject(AuthenticationProvider)
export class HttpClientExtensions {
    requestBuilder = null;
    authenticationProvider: AuthenticationProvider = null;

    constructor(authenticationProvider: AuthenticationProvider) {        
        this.authenticationProvider = authenticationProvider;
    }

    configure() {        
        var withToken = (internalAuth = true, identifier = undefined) => {
            return (client, processor, message) => {
                let token = (internalAuth ? this.getToken() : this.getCustomToken(identifier));

                if (internalAuth) {
                    message.interceptors = message.interceptors || [];
                    message.interceptors.unshift(new AuthenticationInterceptor(this.authenticationProvider));
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