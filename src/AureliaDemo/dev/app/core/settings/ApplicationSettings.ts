import * as Enumerations from 'core/CoreEnumerations';

export class ApplicationSettings {    
    localStorageMode: Enumerations.LocalStorageTypes = Enumerations.LocalStorageTypes.Local;
    baseUrl: string = 'http://localhost:35718/';
    clientId: string = '';
    clientSecret: string = '';
    authorizationScope = 'openid';
    isInDebugMode = true;
    authenticationMode: Enumerations.AuthenticationTypes = Enumerations.AuthenticationTypes.OpenId;
}