import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '../_models/user.model';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class AuthenticationService implements OnInit {
    private loggedIn = false;
    private currentUser: User;

    constructor(private httpService: HttpService, private router: Router, private userService: UserService) {
        var token = localStorage.getItem('id_token');
        var userId = localStorage.getItem('uid');
        if (token && userId) {
            this.loggedIn = true;
            this.refreshDetails(userId);
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
        return this.currentUser;
    }

    login(mobile: string, password: string) {
        this.httpService.get("user.json", []).subscribe((users) => {
            var user = users.find(x => x.mobile === mobile && x.password === password);
            if (user) {
                localStorage.setItem('id_token', "testToken");
                localStorage.setItem('uid', user.userId);
              
                this.loggedIn = true;
                this.currentUser = user;

                this.router.navigate(['/roles']);
                this.userService.setCurrentUser(user);
                this.userService.userDetailsUpdated.next(user);
            }
            else {
                alert("Incorrect credentials!");
            }

        });
    }

    logout() {
        this.loggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('id_token');
        localStorage.removeItem('user');
        //  this.loggedInUserChanged.next(null);
    }

    refreshDetails(userId) {
        this.httpService.get("user.json", []).subscribe((users) => {
            var user = users.find(x => x.userId === userId);
            if (user) {
                localStorage.setItem('id_token', "testToken");
                localStorage.setItem('uid', user.userId);
                this.currentUser = user;
                this.userService.setCurrentUser(user);
                this.userService.userDetailsUpdated.next(user);

            }
            else {
                alert("Incorrect credentials!");
            }

        });

    }
}