import { inject } from 'aurelia-framework'
import { ApplicationSettings } from 'core/settings/ApplicationSettings'
import * as Enumerations from '../Enumerations/';
import { OAuthService, OpenIdService } from '../Services/';
import { LocalStorageProvider } from 'LocalStorageProvider';

export class LoginResult {
    success: boolean = false;
    errorText: string = '';
}

@inject(ApplicationSettings, LocalStorageProvider, OAuthService, OpenIdService)
export class AuthenticationProvider {
    applicationSettings: ApplicationSettings = null;
    localStorageProvider: LocalStorageProvider = null;
    oAuthService: OAuthService = null;
    openIdService: OpenIdService = null;

    constructor(appSettings: ApplicationSettings, localStorageProvider: LocalStorageProvider, oAuthService: OAuthService, openIdService: OpenIdService) {
        this.applicationSettings = appSettings;
        this.localStorageProvider = localStorageProvider;
        this.oAuthService = oAuthService;
        this.openIdService = openIdService;
    }

    login(username: string, password: string): LoginResult {
        var loginResult = new LoginResult();

        switch (this.applicationSettings.authenticationMode) {
            case Enumerations.AuthenticationTypes.OpenId:
                {
                    this.openIdService.requestAccessToken(username, password).then(result => {
                        console.log('AuthenticationProvider => login => OpenId => requestAccessToken', result);
                    });
                    break;
                }
            case Enumerations.AuthenticationTypes.OAuth:
                {
                    break;
                }
            default:
                {
                    var defaultErrorText = 'Warning: Authentication mode not supported. Check ApplicationSettings';
                    console.error(defaultErrorText);
                    loginResult.errorText = defaultErrorText;
                }
        }

        return loginResult;
    }

    logout(): void {
        this.clearToken();
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