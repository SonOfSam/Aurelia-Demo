import * as Enumerations from '../Enumerations/';

export class ApplicationSettings {    
    localStorageMode: Enumerations.LocalStorageTypes = Enumerations.LocalStorageTypes.Local;
    baseUrl: string = 'http://localhost:35718/';
    clientId: string = 'IdentityWebUI';
    clientSecret: string = 'secret';
    authorizationScope = 'openid';
    isInDebugMode = true;
    authenticationMode: Enumerations.AuthenticationTypes = Enumerations.AuthenticationTypes.OpenId;
}