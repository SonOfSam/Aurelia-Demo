import StorageTypes = require("../enumerations/LocalStorageTypes");

export class ApplicationSettings {
    localStorageMode: StorageTypes.LocalStorageTypes = StorageTypes.LocalStorageTypes.Local;
}