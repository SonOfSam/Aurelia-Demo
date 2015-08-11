import { inject } from 'aurelia-framework';
import { AuthenticationProvider } from 'core/CoreProviders';

import { HttpClient } from 'aurelia-http-client';

@inject(AuthenticationProvider, HttpClient)
export class Login {
    authenticationProvider: AuthenticationProvider = null;
    username = '';
    password = '';

    httpClient: HttpClient = null;

    constructor(authenticationProvider: AuthenticationProvider, httpClient: HttpClient) {
        this.authenticationProvider = authenticationProvider;
        this.httpClient = httpClient;
    }

    login() {
        this.authenticationProvider.login(this.username, this.password).then(result => {
            console.log('loginResult', result);
        }).catch(error => {
            console.log('loginResult Error', error);
        });
    }

    test1() {
        this.httpClient.createRequest('http://localhost:35718/api/test')
            .withToken()
            .asGet()
            .send();
    }

    test2() {
        this.httpClient.createRequest('http://localhost:35718/api/test')            
            .asGet()
            .send();
    }

}