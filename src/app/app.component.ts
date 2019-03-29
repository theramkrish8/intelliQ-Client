import { Component, OnInit } from '@angular/core';
import { User } from './_models/user.model';
import { UserService } from './_services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	title = 'IntelliQ';
	currentUser: User;
	loggedIn = false;
	constructor(private userService: UserService) {}

	ngOnInit() {
		this.userService.userDetailsUpdated.subscribe((user: User) => {
			setTimeout(() => {
				this.currentUser = user;
				this.loggedIn = user ? true : false;
			}, 0);
		});
	}
}
