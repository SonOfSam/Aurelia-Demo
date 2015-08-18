import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { AuthenticationProvider } from 'core/CoreProviders';

@inject(AuthenticationProvider)
export class NavTop {
    @bindable router = null;
    authenticationProvider: AuthenticationProvider = null;

    constructor(authenticationProvider: AuthenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    get isAuthenticated(): Promise<boolean> {
        return this.authenticationProvider.isAuth();
    }
}