import { Injectable, OnInit } from '@angular/core';
import { RestService } from './rest.service';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { User } from '../_models/user.model';
import { AppResponse } from '../_models/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable()
export class AuthenticationService implements OnInit {
	private loggedIn = false;

	constructor(
		private restService: RestService,
		private userService: UserService,
		private localStorageService: LocalStorageService,
		private router: Router,
		private notificationService: NotificationService
	) {
		var token = this.localStorageService.getItemFromLocalStorage('id_token', false);
		var user = this.localStorageService.getCurrentUser();
		// check session at server

		if (token && user) {
			this.loggedIn = true;
			this.refreshDetails(user.userId);
		} else {
			this.logout(false, true);
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

	logout(invalidateServerSession: boolean, redirectToLogin: boolean) {
		this.loggedIn = false;
		this.localStorageService.removeItemsFromLocalStorage([ 'id_token', 'user', 'group' ]);
		this.userService.userDetailsUpdated.next(null);
		if (invalidateServerSession) {
			// rest call to logout
		}
		if (redirectToLogin) {
			this.router.navigate([ '/login' ]);
		}
	}

	refreshDetails(userId: String) {
		this.restService.get('user/info/_id/' + userId).subscribe((appResponse: AppResponse) => {
			if (appResponse.status === ResponseStatus.ERROR) {
				this.notificationService.showErrorWithTimeout(appResponse.msg, null, 2000);
				this.logout(false, true);
			} else if (appResponse.status === ResponseStatus.SUCCESS) {
				if (appResponse.body) {
					this.persistUser(appResponse.body);
				} else {
					this.logout(true, true);
				}
			}
		});
	}
}
