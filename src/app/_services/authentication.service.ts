import { Injectable, OnInit } from '@angular/core';
import { RestService } from './rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService } from './local-storage-service';


@Injectable()
export class AuthenticationService implements OnInit {
    private loggedIn = false;

    constructor(private restService: RestService, private userService: UserService, private localStorageService: LocalStorageService) {
        var token = this.localStorageService.getItemFromLocalStorage('id_token');
        var user = this.localStorageService.getCurrentUser();

        if (token && user) {
            this.loggedIn = true;
            this.refreshDetails(user.userId);
        } else {
            this.logout();
        }
    }

    ngOnInit() {
    }

    isAuthenticated(): boolean {
        return this.loggedIn;
    }

    getCurrentUser() {
        return this.localStorageService.getCurrentUser();
    }

    login(mobile: string, password: string) {
        return this.restService.get("user.json", []).pipe(map(users => {
            var user = users.find(x => x.mobile === mobile && x.password === password);
            if (user) {
                this.localStorageService.addItemsToLocalStorage(['id_token', 'user'], ["testToken", JSON.stringify(user)]);
                this.loggedIn = true;
                this.userService.userDetailsUpdated.next(user);
            }
            else {
                alert("Incorrect credentials!");
            }

            return user;
        }));

    }

    logout() {
        this.loggedIn = false;
        this.localStorageService.removeItemsFromLocalStorage(['id_token', 'user']);
        this.userService.userDetailsUpdated.next(null);
    }

    refreshDetails(userId: String) {
        this.restService.get("user.json", []).subscribe((users) => {
            var user = users.find(x => x.userId === userId);
            if (user) {
                this.localStorageService.addItemsToLocalStorage(['id_token', 'user'], ["testToken", JSON.stringify(user)]);
                this.userService.userDetailsUpdated.next(user);
            }
            else {
                alert("Incorrect credentials!");
            }
        });
    }

}