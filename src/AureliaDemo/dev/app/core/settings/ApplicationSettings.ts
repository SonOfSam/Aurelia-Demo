import StorageTypes = require("../enumerations/LocalStorageTypes");

export class ApplicationSettings {
    localStorageMode: StorageTypes.LocalStorageTypes = StorageTypes.LocalStorageTypes.Local;
    baseUrl: string = 'http://localhost:35718/';
    clientId: string = 'IdentityWebUI';
    clientSecret: string = 'secret';
    authorizationScope = 'openid';
    isInDebugMode = true;
}