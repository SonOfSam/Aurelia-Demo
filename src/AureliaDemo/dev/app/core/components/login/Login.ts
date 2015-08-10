import { inject } from 'aurelia-framework';
import { AuthenticationProvider } from 'core/CoreProviders';

@inject(AuthenticationProvider)
export class Login {
    authenticationProvider: AuthenticationProvider = null;
    username = '';
    password = '';

    constructor(authenticationProvider: AuthenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    login() {
        this.authenticationProvider.login(this.username, this.password).then(result => {
            console.log('loginResult', result);
        }).catch(error => {
            console.log('loginResult Error', error);
        });
    }
}