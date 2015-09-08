import { inject } from 'aurelia-framework';
import { ApplicationSettings } from 'core/CoreSettings';
import { HttpClient } from 'aurelia-http-client';
import { Base64 } from 'core/helpers/Base64';

@inject(ApplicationSettings, HttpClient, Base64)
export class OpenIdService {
    applicationSettings: ApplicationSettings = null;
    httpClient: HttpClient = null;
    configEndpoint: string = '.well-known/openid-configuration';
    serverConfiguration: OpenIdTypes.IServerConfiguration = null;
    base64Helper: Base64 = null;

    constructor(appSettings: ApplicationSettings, httpClient: HttpClient, base64Helper: Base64) {
        this.applicationSettings = appSettings;
        this.httpClient = httpClient;
        this.base64Helper = base64Helper;
    }

    getServerConfiguration() {
        var url = `${this.applicationSettings.baseUrl}${this.configEndpoint}`;
        return this.httpClient.get(url).then(responseResult => {
            this.serverConfiguration = JSON.parse(responseResult.response);
        });
    }

    requestAccessToken(userName: string, password: string): Promise<AccessTokenRequestResult> {
        var loginResult = new AccessTokenRequestResult();
        var promise: Promise<AccessTokenRequestResult> = null;

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
                    if (response.isSuccess) {
                        var loginResponse = JSON.parse(response.response);
                        console.log("login", response);
                        loginResult.token = loginResponse.access_token;
                        loginResult.refreshToken = loginResponse.refresh_token;
                        loginResult.success = true;
                        resolve(loginResult);
                    } else {
                        var errorResponse = JSON.parse(response.response);
                        loginResult.success = false;
                        loginResult.errorText = errorResponse;
                        resolve(loginResult);
                    }
                }).catch(error => {
                    var errorResponse = JSON.parse(error.response);
                    loginResult.success = false;
                    loginResult.errorText = errorResponse.error;
                    reject(loginResult);
                });
        });

        return promise;
    }

    refreshToken(token: string): Promise<AccessTokenRequestResult> {
        var loginResult = new AccessTokenRequestResult();
        return new Promise<AccessTokenRequestResult>((resolve, reject) => {
            try {
                if (token.length < 10) {
                    loginResult.success = false;
                    loginResult.errorText = "Not a valid token to refresh";
                    reject(loginResult);
                }
                var credentials = `${this.applicationSettings.clientId}:${this.applicationSettings.clientSecret}`;
                var credentialsBase64Value = this.base64Helper.encode(credentials);
                var credentialsHeaderValue = `${"Basic "}${credentialsBase64Value}`;

                var grantContent = 'grant_type=refresh_token';
                var tokenContent = `${"&refresh_token="}${token}`;
                var bodyContent = `${grantContent}${tokenContent}`;

                this.httpClient.createRequest(this.serverConfiguration.token_endpoint)
                    .withHeader('Authorization', credentialsHeaderValue)
                    .withHeader('Content-Type', 'application/x-www-form-urlencoded')
                    .asPost()
                    .withContent(bodyContent)
                    .send()
                    .then(response => {
                        if (response.isSuccess) {
                            console.log("refresh", response);
                            var loginResponse = JSON.parse(response.response);
                            loginResult.token = loginResponse.access_token;
                            loginResult.refreshToken = loginResponse.refresh_token;
                            loginResult.success = true;
                            resolve(loginResult);
                        } else {
                            var errorResponse = JSON.parse(response.response);
                            loginResult.success = false;
                            loginResult.errorText = errorResponse;
                            resolve(loginResult);
                        }
                    }).catch(error => {
                        var errorResponse = JSON.parse(error.response);
                        loginResult.success = false;
                        loginResult.errorText = errorResponse.error;
                        reject(loginResult);
                    });
            } catch (error) {
                var errorResponse = JSON.parse(error.response);
                loginResult.success = false;
                loginResult.errorText = errorResponse.error;
                reject(loginResult);
            }
        });
    }
}

export class AccessTokenRequestResult {
    success: boolean = false;
    errorText: string = '';
    token: string = null;
    refreshToken: string = null;
}