import { Injectable, OnInit } from '@angular/core';
import { RestService } from './rest.service';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { User } from '../_models/user.model';
import { AppResponse } from '../_models/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService implements OnInit {
	private loggedIn = false;

	constructor(
		private restService: RestService,
		private userService: UserService,
		private localStorageService: LocalStorageService,
		private router: Router
	) {
		var token = this.localStorageService.getItemFromLocalStorage('id_token');
		var user = this.localStorageService.getCurrentUser();
		// check session at server

		if (token && user) {
			this.loggedIn = true;
			this.refreshDetails(user.userId);
		} else {
			this.logout(false);
		}
	}

	ngOnInit() {}

	isAuthenticated(): boolean {
		return this.loggedIn;
	}

	login(user: User) {
		return this.restService.post('user/login', user);
	}

	persistUser(user: User) {
		this.localStorageService.addItemsToLocalStorage([ 'id_token', 'user' ], [ 'testToken', JSON.stringify(user) ]);
		this.loggedIn = true;
		this.userService.userDetailsUpdated.next(user);
	}

	logout(invalidateServerSession: boolean) {
		this.loggedIn = false;
		this.localStorageService.removeItemsFromLocalStorage([ 'id_token', 'user', 'currentRole' ]);
		this.userService.userDetailsUpdated.next(null);
		if (invalidateServerSession) {
			// rest call to logout
		}
	}

	refreshDetails(userId: String) {
		this.restService.get('user/info/_id/' + userId, []).subscribe((appResponse: AppResponse) => {
			if (appResponse.status === ResponseStatus.ERROR) {
				this.logout(false);
			} else if (appResponse.status === ResponseStatus.SUCCESS) {
				this.persistUser(appResponse.body);
			}
		});
	}
}
