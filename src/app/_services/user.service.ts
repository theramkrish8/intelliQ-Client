import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { UtilityService } from './utility.service';

@Injectable()
export class UserService implements OnInit {
	userDetailsUpdated = new Subject();
	constructor(private localStorageService: LocalStorageService, private utilityService: UtilityService) {}

	ngOnInit(): void {}
	getUserRoles() {
		var user = this.localStorageService.getCurrentUser();
		if (user) {
			var roles = [];
			user.roles.forEach((role) => {
				roles.push(this.utilityService.getRoleDescription(role.roleType));
			});
			return roles;
		}
		return null;
	}
}
