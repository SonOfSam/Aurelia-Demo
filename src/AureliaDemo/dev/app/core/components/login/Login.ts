import { inject } from 'aurelia-framework'
import { AuthenticationProvider } from 'core/CoreProviders'

@inject(AuthenticationProvider)
export class Login {
    authenticationProvider: AuthenticationProvider = null;
    username = '';
    password = '';

    constructor(authenticationProvider: AuthenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    login() {
        var loginResult = this.authenticationProvider.login(this.username, this.password);
        console.log('loginResult', loginResult);
    }
}