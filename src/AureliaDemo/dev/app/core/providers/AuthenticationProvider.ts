import { inject } from 'aurelia-framework';
import { ApplicationSettings } from 'core/CoreSettings';
import * as Enumerations from 'core/CoreEnumerations';
import { OAuthService, OpenIdService } from 'core/CoreServices';
import { LocalStorageProvider } from 'core/providers/LocalStorageProvider';

@inject(ApplicationSettings, LocalStorageProvider, OAuthService, OpenIdService)
export class AuthenticationProvider {
    applicationSettings: ApplicationSettings = null;
    localStorageProvider: LocalStorageProvider = null;
    oAuthService: OAuthService = null;
    openIdService: OpenIdService = null;
    isAuthenticated: boolean = false;

    constructor(appSettings: ApplicationSettings, localStorageProvider: LocalStorageProvider, oAuthService: OAuthService, openIdService: OpenIdService) {
        this.applicationSettings = appSettings;
        this.localStorageProvider = localStorageProvider;
        this.oAuthService = oAuthService;
        this.openIdService = openIdService;
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
                                //TODO: Save token here
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
                    loginResult.errorText = "Not yet implemented";
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

    isAuth(): boolean {
        return this.isAuthenticated;
    }

    logout(): void {
        this.clearToken();
        this.isAuthenticated = false;
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
}

export class LoginResult {
    success: boolean = false;
    errorText: string = '';
}