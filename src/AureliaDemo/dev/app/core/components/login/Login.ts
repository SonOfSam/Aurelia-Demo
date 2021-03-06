﻿import { inject } from 'aurelia-framework';
import { AuthenticationProvider } from 'core/CoreProviders';
import { Router } from 'aurelia-router'

import { HttpClient } from 'aurelia-http-client';

@inject(AuthenticationProvider, HttpClient, Router)
export class Login {
    authenticationProvider: AuthenticationProvider = null;
    username = '';
    password = '';

    httpClient: HttpClient = null;
    router: Router = null;

    constructor(authenticationProvider: AuthenticationProvider, httpClient: HttpClient, router: Router) {
        this.authenticationProvider = authenticationProvider;
        this.httpClient = httpClient;
        this.router = router;
    }

    login() {
        this.authenticationProvider.login(this.username, this.password).then(result => {
            //this.router.navigate('welcome');
            console.log('login() => ', result);
        }).catch(error => {
            console.log('loginResult Error', error);
        });
    }

    refresh() {
        this.authenticationProvider.refreshToken().then(result => {
            console.log('refreshToken() => ', result);
        }).catch(error => {
            console.log('refreshToken Error', error);
        });
    }

    test1() {
        (<any>this.httpClient.createRequest('http://localhost:35718/api/test'))
            .withToken()
            .asGet()
            .send().then(result => {
                console.log(result);
            });        
    }

    test2() {
        (<any>this.httpClient.createRequest('http://localhost:35718/api/test'))
            .asGet()
            .send().then(result => {
                console.log(result);
            });
    }
}