import {inject} from 'aurelia-framework';
import { ApplicationSettings } from 'settings/ApplicationSettings'
import StorageTypes = require("../enumerations/LocalStorageTypes");

@inject(ApplicationSettings)
export class LocalStorageProvider {
    applicationSettings: ApplicationSettings;

    constructor(appSettings: ApplicationSettings) {
        this.applicationSettings = appSettings;
    }

    get(key : string) {
        switch (this.applicationSettings.localStorageMode) {
            case StorageTypes.LocalStorageTypes.Local:
                {
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        return localStorage.getItem(key);
                    } else {
                        console.warn('Warning: Local Storage is disabled or unavailable');
                        return undefined;
                    }
                }
            case StorageTypes.LocalStorageTypes.Session:
                {
                    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                        return sessionStorage.getItem(key);
                    } else {
                        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                        return undefined;
                    }
                }
                default:
                {
                    console.warn('Warning: The configured local storage value is not valid, please check application settings.');
                    return undefined;
                }
        }
    }

    set(key : string, value : any) {
        switch (this.applicationSettings.localStorageMode) {
            case StorageTypes.LocalStorageTypes.Local:
                {
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        return localStorage.setItem(key, value);
                    } else {
                        console.warn('Warning: Local Storage is disabled or unavailable');
                        return undefined;
                    }
                }
            case StorageTypes.LocalStorageTypes.Session:
                {
                    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                        return sessionStorage.setItem(key, value);
                    } else {
                        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                        return undefined;
                    }
                }
            default:
                {
                    console.warn('Warning: The configured local storage value is not valid, please check application settings.');
                    return undefined;
                }
        }
    }

    remove(key : string) {
        switch (this.applicationSettings.localStorageMode) {
            case StorageTypes.LocalStorageTypes.Local:
                {
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        return localStorage.removeItem(key);
                    } else {
                        console.warn('Warning: Local Storage is disabled or unavailable');
                        return undefined;
                    }
                }
            case StorageTypes.LocalStorageTypes.Session:
                {
                    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                        return sessionStorage.removeItem(key);
                    } else {
                        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                        return undefined;
                    }
                }
            default:
                {
                    console.warn('Warning: The configured local storage value is not valid, please check application settings.');
                    return undefined;
                }
        }
    }
}