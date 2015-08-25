import { inject } from 'aurelia-framework';
import { ApplicationSettings } from 'core/CoreSettings';
import * as Enumerations from 'core/CoreEnumerations';
import { OAuthService, OpenIdService } from 'core/CoreServices';
import { LocalStorageProvider } from 'core/providers/LocalStorageProvider';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(ApplicationSettings, LocalStorageProvider, OAuthService, OpenIdService, EventAggregator)
export class AuthenticationProvider {
    applicationSettings: ApplicationSettings = null;
    localStorageProvider: LocalStorageProvider = null;
    oAuthService: OAuthService = null;
    openIdService: OpenIdService = null;
    isAuthenticated: boolean = false;
    eventAggregator: EventAggregator = null;

    constructor(appSettings: ApplicationSettings, localStorageProvider: LocalStorageProvider, oAuthService: OAuthService, openIdService: OpenIdService, eventAggregator: EventAggregator) {
        this.applicationSettings = appSettings;
        this.localStorageProvider = localStorageProvider;
        this.oAuthService = oAuthService;
        this.openIdService = openIdService;
        this.eventAggregator = eventAggregator;
    }

    login(username: string, password: string): Promise<LoginResult> {
        var loginResult = new LoginResult();
        var promise: Promise<LoginResult> = null;

        switch (this.applicationSettings.authenticationMode) {
            case Enumerations.AuthenticationTypes.OpenId:
                {
                    promise = new Promise<LoginResult>((resolve, reject) => {
                        this.openIdService.requestAccessToken(username, password).then(result => {
                            loginResult.success = result.success;
                            loginResult.errorText = result.errorText;
                            this.isAuthenticated = loginResult.success;
                            if (loginResult.success) {
                                this.setToken(result.token);
                                this.publish(true);
                            }
                            resolve(loginResult);
                        }).catch(error => {
                            loginResult.success = false;
                            loginResult.errorText = error.errorText;
                            reject(loginResult);
                        });
                    });
                    break;
                }
            case Enumerations.AuthenticationTypes.OAuth:
                {
                    loginResult.errorText = 'Not yet implemented';
                    promise = new Promise<LoginResult>((resolve) => {
                        resolve(loginResult);
                    });
                    break;
                }
            default:
                {
                    var defaultErrorText = 'Warning: Authentication mode not supported. Check ApplicationSettings';
                    console.error(defaultErrorText);
                    loginResult.errorText = defaultErrorText;
                    promise = new Promise<LoginResult>((resolve) => {
                        resolve(loginResult);
                    });
                }
        }

        return promise;
    }

    isAuth(): Promise<boolean> {
        var promise = new Promise<boolean>((resolve, reject) => {
            try {
                var token = this.getToken();

                if (token === null || typeof token === 'undefined' || token.length === 0) {

                    resolve(false);
                } else {
                    // TODO: Implement better logic around the isAuth concept? 
                    // This is a starting point.
                    // Ideally one might require more logic,
                    // other than just basing it on the presence of a token                    
                    resolve(true);
                }
            } catch (error) {
                reject(false);
            }
        });

        return promise;
    }

    logout(): Promise<boolean> {
        var promise = new Promise<boolean>((resolve, reject) => {
            try {
                this.clearToken();
                this.isAuthenticated = false;
                this.publish(false);
                resolve(true);
            } catch (error) {
                reject(false);
            }
        });

        return promise;
    }

    refreshToken(): Promise<LoginResult> {
        var loginResult = new LoginResult();
        return new Promise<LoginResult>((resolve, reject) => {
            try {
                var currentToken = this.getToken();
                switch (this.applicationSettings.authenticationMode) {
                    case Enumerations.AuthenticationTypes.OpenId:
                        {
                            this.openIdService.refreshToken(currentToken).then(result => {
                                loginResult.success = result.success;
                                loginResult.errorText = result.errorText;
                                if (loginResult.success) {
                                    this.setToken(result.token);
                                    resolve(loginResult);
                                } else {
                                    reject(loginResult);
                                }
                            }).catch(error => {
                                loginResult.success = false;
                                loginResult.errorText = error.errorText;
                                reject(loginResult);
                            });
                            break;
                        }
                    case Enumerations.AuthenticationTypes.OAuth:
                        {
                            reject('OAuth Not Implemented Yet');
                            break;
                        }
                    default:
                        {
                            var defaultErrorText = 'Warning: Authentication mode not supported. Check ApplicationSettings';
                            console.error(defaultErrorText);
                            loginResult.errorText = defaultErrorText;
                            loginResult.success = false;
                            reject(loginResult);
                        }
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    setToken(token: string): void {
        this.localStorageProvider.set('authToken', token);
    }

    getToken(): string {
        return this.localStorageProvider.get('authToken');
    }

    clearToken(): void {
        this.localStorageProvider.remove('authToken');
    }

    publish(isLogin: boolean): void {
        this.eventAggregator.publish('LoginEvent', isLogin);
    }
}

export class LoginResult {
    success: boolean = false;
    errorText: string = '';
}