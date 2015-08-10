import { inject } from 'aurelia-framework';
import { ApplicationSettings } from 'core/CoreSettings';
import { HttpClient } from 'aurelia-http-client';
import { Base64 } from 'core/helpers/Base64';

@inject(ApplicationSettings, HttpClient, Base64)
export class OpenIdService {
    applicationSettings: ApplicationSettings = null;
    httpClient: HttpClient = null;
    configEndpoint: string = 'core/.well-known/openid-configuration';
    serverConfiguration: OpenIdTypes.IServerConfiguration = null;
    base64Helper: Base64 = null;

    constructor(appSettings: ApplicationSettings, httpClient: HttpClient, base64Helper: Base64) {
        this.applicationSettings = appSettings;
        this.httpClient = httpClient;
        this.base64Helper = base64Helper;
    }

    getServerConfiguration() {
        if (this.applicationSettings.isInDebugMode) {
            console.log("OpenIdService => this.getServerConfiguration => Request Start");
        }

        var url = `${this.applicationSettings.baseUrl}${this.configEndpoint}`;
        return this.httpClient.get(url).then(responseResult => {
            if (this.applicationSettings.isInDebugMode) {
                console.log("OpenIdService => this.getServerConfiguration => Request End");
            }

            this.serverConfiguration = JSON.parse(responseResult.response);
        });
    }

    requestAccessToken(userName: string, password: string): Promise<AccessTokenRequestResult> {
        var loginResult = new AccessTokenRequestResult();
        var promise: Promise<AccessTokenRequestResult> = null;

        if (this.applicationSettings.isInDebugMode) {
            console.log("OpenIdService => this.serverConfiguration: ", this.serverConfiguration);
        }

        if (this.serverConfiguration === null) {
            promise = new Promise<AccessTokenRequestResult>((resolve, reject) => {
                this.getServerConfiguration().then(something => {
                    if (this.applicationSettings.isInDebugMode) {
                        console.log("OpenIdService => this.requestAccessToken => Recursive");
                    }

                    resolve(this.requestAccessToken(userName, password));
                });
            });

            return promise;
        }

        if (this.applicationSettings.isInDebugMode) {
            console.log("OpenIdService => this.requestAccessToken => Proceeding to call token endpoint");
        }

        var credentials = `${this.applicationSettings.clientId}:${this.applicationSettings.clientSecret}`;
        var credentialsBase64Value = this.base64Helper.encode(credentials);
        var credentialsHeaderValue = `${"Basic "}${credentialsBase64Value}`;
        var grantContent = 'grant_type=password';
        var userNameContent = `${"&username="}${userName}`;
        var passwordContent = `${"&password="}${password}`;
        var scopeContent = `${"&scope="}${this.applicationSettings.authorizationScope}`;

        var bodyContent = `${grantContent}${userNameContent}${passwordContent}${scopeContent}`;

        promise = new Promise<AccessTokenRequestResult>((resolve, reject) => {
            this.httpClient.createRequest(this.serverConfiguration.token_endpoint)
                .withHeader('Authorization', credentialsHeaderValue)
                .withHeader('Content-Type', 'application/x-www-form-urlencoded')
                .asPost()
                .withContent(bodyContent)
                .send()
                .then(response => {
                    loginResult.success = true;
                    resolve(loginResult);
                }).catch(error => {
                    loginResult.success = false;
                    reject(loginResult);
                });
        });

        return promise;
    }
}

export class AccessTokenRequestResult {
    success: boolean = false;
    errorText: string = '';
    token: string = null;
}