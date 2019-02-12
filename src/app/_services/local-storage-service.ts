import { jsonpFactory } from "@angular/http/src/http_module";
import { User } from "../_models/user.model";

export class LocalStorageService {

    getCurrentUser(): User {
        var user = localStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    addItemToLocalStorage(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    addItemsToLocalStorage(keys: string[], values: string[]) {
        for (var i = 0; i < keys.length; i++) {
            localStorage.setItem(keys[i], values[i]);
        }
    }

    getItemFromLocalStorage(key: string) {
        return localStorage.getItem(key);
    }

    removeItemFromLocalStorage(key: string) {
        localStorage.removeItem(key);
    }

    removeItemsFromLocalStorage(keys: string[]) {
        for (var i = 0; i < keys.length; i++) {
            localStorage.removeItem(keys[i]);
        }
    }

}