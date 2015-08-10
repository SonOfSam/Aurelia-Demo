import { inject } from 'aurelia-framework'
import { ApplicationSettings } from 'core/settings/ApplicationSettings'
import { HttpClient } from 'aurelia-http-client';
import { Base64 } from 'core/helpers/Base64'

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
        var url = `${this.applicationSettings.baseUrl}${this.configEndpoint}`;
        return this.httpClient.get(url).then(responseResult => {            
            this.serverConfiguration = JSON.parse(responseResult.response);            
        });
    }

    requestAccessToken(userName: string, password: string) {        
        if (this.applicationSettings.isInDebugMode) {
            console.log("OpenIdService => this.serverConfiguration: ", this.serverConfiguration);
        }

        if (this.serverConfiguration === null) {
            this.getServerConfiguration().then(something => {
                return this.requestAccessToken(userName, password);
            });            
        }

        var credentials = `${this.applicationSettings.clientId}:${this.applicationSettings.clientSecret}`;
        var credentialsBase64Value = this.base64Helper.encode(credentials);
        var credentialsHeaderValue = `${"Basic "}${credentialsBase64Value}`;
        var grantContent = 'grant_type=password';
        var userNameContent = `${"&username="}${userName}`;
        var passwordContent = `${"&password="}${password}`;
        var scopeContent = `${"&scope="}${this.applicationSettings.authorizationScope}`;

        var bodyContent = `${grantContent}${userNameContent}${passwordContent}${scopeContent}`;

        return this.httpClient.createRequest(this.serverConfiguration.token_endpoint)
            .withHeader('Authorization', credentialsHeaderValue)
            .withHeader('Content-Type', 'application/x-www-form-urlencoded')
            .asPost()
            .withContent(bodyContent)
            .send();
    }
}