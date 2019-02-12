
import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { LocalStorageService } from "./local-storage-service";

@Injectable()
export class UserService implements OnInit {
    userDetailsUpdated = new Subject();
    constructor(private localStorageService: LocalStorageService) {

    }

    ngOnInit(): void {

    }
    getUserRoles() {
        var user = this.localStorageService.getCurrentUser();
        if (user) {
            return user.roles;
        }
        return null;
    }

}