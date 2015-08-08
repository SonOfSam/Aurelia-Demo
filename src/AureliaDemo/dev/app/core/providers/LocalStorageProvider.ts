import {inject} from 'aurelia-framework';
import { ApplicationSettings } from 'settings/ApplicationSettings'
import StorageTypes = require("../enumerations/LocalStorageTypes");

@inject(ApplicationSettings)
export class LocalStorageProvider {
    applicationSettings: ApplicationSettings;

    constructor(appSettings: ApplicationSettings) {
        this.applicationSettings = appSettings;
    }

    get(key : string) : any {
        switch (this.applicationSettings.localStorageMode) {
            case StorageTypes.LocalStorageTypes.Local:
                {
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        return localStorage.getItem(key);
                    } else {
                        console.warn('Warning: Local Storage is disabled or unavailable');
                        return null;
                    }
                }
            case StorageTypes.LocalStorageTypes.Session:
                {
                    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                        return sessionStorage.getItem(key);
                    } else {
                        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                        return null;
                    }
                }
                default:
                {
                    console.warn('Warning: The configured local storage value is not valid, please check application settings.');
                    return null;
                }
        }
    }

    set(key : string, value : any) : void {
        switch (this.applicationSettings.localStorageMode) {
            case StorageTypes.LocalStorageTypes.Local:
                {
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        localStorage.setItem(key, value);
                    } else {
                        console.warn('Warning: Local Storage is disabled or unavailable');                        
                    }
                }
            case StorageTypes.LocalStorageTypes.Session:
                {
                    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                        sessionStorage.setItem(key, value);
                    } else {
                        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');                        
                    }
                }
            default:
                {
                    console.warn('Warning: The configured local storage value is not valid, please check application settings.');                    
                }
        }
    }

    remove(key : string) : void {
        switch (this.applicationSettings.localStorageMode) {
            case StorageTypes.LocalStorageTypes.Local:
                {
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        localStorage.removeItem(key);
                    } else {
                        console.warn('Warning: Local Storage is disabled or unavailable');                        
                    }
                }
            case StorageTypes.LocalStorageTypes.Session:
                {
                    if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                        sessionStorage.removeItem(key);
                    } else {
                        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');                        
                    }
                }
            default:
                {
                    console.warn('Warning: The configured local storage value is not valid, please check application settings.');                    
                }
        }
    }
}