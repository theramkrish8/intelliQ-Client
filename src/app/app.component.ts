import { Component, OnInit } from '@angular/core';
import { User } from './_models/user.model';
import { UserService } from './_services/user.service';
import { AuthenticationService } from './_services/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	title = 'IntelliQ';
	currentUser: User;
	loggedIn = false;
	constructor(private userService: UserService, private authService: AuthenticationService) {}

	ngOnInit() {
		this.userService.userDetailsUpdated.subscribe((user: User) => {
			setTimeout(() => {
				this.currentUser = user;
				this.loggedIn = user ? true : false;
			}, 0);
		});
	}
	logout() {
		this.authService.logout(true);
	}
}
