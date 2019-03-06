import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from './_models/user.model';
import { RestService } from './_services/rest.service';
import { UserService } from './_services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	title = 'IntelliQue';
	currentUser: User;
	loggedIn = false;
	constructor(private userService: UserService, private restService: RestService) {}

	ngOnInit() {
		this.userService.userDetailsUpdated.subscribe((user: User) => {
			setTimeout(() => {
				this.currentUser = user;
				this.loggedIn = user ? true : false;
			}, 0);
		});
	}
}
