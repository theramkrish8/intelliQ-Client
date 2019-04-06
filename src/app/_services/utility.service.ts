import { RoleType, ResponseStatus } from '../_models/enums';
import { AppResponse } from '../_dto/app-response.model';
import { NotificationService } from './notification.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Role } from '../_models/role.model';

@Injectable()
export class UtilityService {
	constructor(
		private notificationService: NotificationService,
		private localStorageService: LocalStorageService,
		private router: Router
	) {}

	getRoleDescription(roleType: RoleType) {
		switch (roleType) {
			case RoleType.SUPERADMIN:
				return 'super-admin';

			case RoleType.GROUPADMIN:
				return 'group-admin';

			case RoleType.SCHOOLADMIN:
				return 'school-admin';

			case RoleType.REVIEWER:
				return 'reviewer';

			case RoleType.TEACHER:
				return 'teacher';
		}
	}
	getRoleCode(roleDesc: String): any {
		switch (roleDesc) {
			case 'super-admin':
				return RoleType.SUPERADMIN;

			case 'group-admin':
				return RoleType.GROUPADMIN;

			case 'school-admin':
				return RoleType.SCHOOLADMIN;

			case 'reviewer':
				return RoleType.REVIEWER;

			case 'teacher':
				return RoleType.TEACHER;
			default:
				return '';
		}
	}

	getAppResponse(appResponse: AppResponse, showError: boolean, showSuccess: boolean) {
		var timeOut = 3000;
		if (appResponse.status === ResponseStatus.FORBIDDEN) {
			this.notificationService.showErrorWithTimeout(appResponse.msg, null, timeOut);
			this.localStorageService.removeItemsFromLocalStorage([ 'user', 'group', 'school' ]);
			this.router.navigate([ '/login' ]);

			return null;
		} else if (appResponse.status === ResponseStatus.ERROR) {
			if (showError) {
				this.notificationService.showErrorWithTimeout(appResponse.msg, null, timeOut);
			}
			return null;
		} else if (appResponse.status === ResponseStatus.SUCCESS) {
			if (showSuccess) {
				this.notificationService.showSuccessWithTimeout(appResponse.body, null, timeOut);
			}
			return appResponse.body;
		}
	}

	isValidMobile(mobile: string): boolean {
		if (mobile && mobile.length === 10 && /^\d{10}$/.test(mobile)) {
			return true;
		}
		return false;
	}

	findRoleIndex(roles: Role[], roleType: RoleType) {
		return roles.findIndex((x) => x.roleType === roleType);
	}
}
