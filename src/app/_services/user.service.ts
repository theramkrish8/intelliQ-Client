import { User } from "../_models/user.model";
import { Injectable, OnInit } from "@angular/core";
import { HttpService } from "./http.service";
import { AuthenticationService } from "./authentication.service";
import { Subject } from "rxjs";

@Injectable()
export class UserService implements OnInit {
    userDetailsUpdated = new Subject();
    private currentUser: User;
    constructor(private httpService: HttpService) {

    }

    ngOnInit(): void {

    }
    getUserRoles() {
        if (this.currentUser) {
            return this.currentUser.roles;
        }
        return null;
    }
    setCurrentUser(user: User) {
        this.currentUser = user;
    }
    getCurrentUser() {
        return this.currentUser;
    }
}