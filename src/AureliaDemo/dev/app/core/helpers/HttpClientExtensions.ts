import { inject } from 'aurelia-framework';
import { RequestBuilder } from 'aurelia-http-client';
import { AuthenticationProvider } from "core/CoreProviders"

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