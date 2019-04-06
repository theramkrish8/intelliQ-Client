import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { User } from '../_models/user.model';
import { AppResponse } from '../_dto/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable()
export class AuthenticationService implements OnInit {
	constructor(
		private userService: UserService,
		private localStorageService: LocalStorageService,
		private router: Router,
		private notificationService: NotificationService
	) {
		var user = this.localStorageService.getCurrentUser();
		if (user) {
			this.refreshDetails(user.userId);
		}
	}

	ngOnInit() {}

	isAuthenticated(): boolean {
		return this.localStorageService.getCurrentUser() !== null;
	}

	login(user: User) {
		return this.userService.login(user);
	}

	persistUser(user: User) {
		this.localStorageService.addItemsToLocalStorage([ 'user' ], [ JSON.stringify(user) ]);
		this.userService.userDetailsUpdated.next(user);
	}

	logout(redirectToLogin: boolean) {
		this.localStorageService.removeItemsFromLocalStorage([ 'user', 'group', 'school' ]);
		this.userService.userDetailsUpdated.next(null);

		this.userService.logout();

		if (redirectToLogin) {
			this.router.navigate([ '/login' ]);
		}
	}

	refreshDetails(userId: String) {
		this.userService.getUserById(userId).subscribe((appResponse: AppResponse) => {
			if (appResponse.status === ResponseStatus.ERROR) {
				this.notificationService.showErrorWithTimeout(appResponse.msg, null, 2000);
				this.logout(true);
			} else if (appResponse.status === ResponseStatus.SUCCESS) {
				if (appResponse.body) {
					this.persistUser(appResponse.body);
				} else {
					this.logout(true);
				}
			}
		});
	}
}
