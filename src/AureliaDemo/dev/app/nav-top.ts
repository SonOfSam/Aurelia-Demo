import { inject, bindable } from 'aurelia-framework';
import { AuthenticationProvider } from 'core/CoreProviders';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(AuthenticationProvider, EventAggregator)
export class NavTop {
    @bindable router = null;
    authenticationProvider: AuthenticationProvider = null;
    isAuthenticated: boolean = false;
    eventAggregator: EventAggregator = null;

    constructor(authenticationProvider: AuthenticationProvider, eventAggregator: EventAggregator) {
        this.authenticationProvider = authenticationProvider;
        this.eventAggregator = eventAggregator;
    }

    logout() {
        this.authenticationProvider.logout().then(result => {
            this.router.navigate('welcome');
        }).catch(error => {
            console.log('logoutResult Error', error);
        });
    }

    subscribe(): void {
        this.eventAggregator.subscribe('LoginEvent', isLogin => {
            this.isAuthenticated = isLogin;
        });
    }

    attached() {
        this.subscribe();
        return this.authenticationProvider.isAuth().then(isAuth => this.isAuthenticated = isAuth);
    }
}