import { RoleType, ResponseStatus, LengthType, DifficultyType } from '../_models/enums';
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
	getLengthEnum(section: string) {
		switch (section) {
			case 'OBJECTIVE':
				return LengthType.OBJECTIVE;
			case 'SHORT':
				return LengthType.SHORT;
			case 'BRIEF':
				return LengthType.BRIEF;
			case 'LONG':
				return LengthType.LONG;
		}
	}
	getDifficultyEnum(difficultyLevel: string) {
		switch (difficultyLevel) {
			case 'EASY':
				return DifficultyType.EASY;
			case 'MEDIUM':
				return DifficultyType.MEDIUM;
			case 'HARD':
				return DifficultyType.HARD;
		}
	}
	getClassForSection(section: string) {
		switch (section) {
			case 'OBJECTIVE':
				return 'panel panel-info';
			case 'SHORT':
				return 'panel panel-warning';
			case 'BRIEF':
				return 'panel panel-danger';
			case 'LONG':
				return 'panel panel-success';
		}
	}

	getSectionDesc(section: LengthType) {
		switch (section) {
			case LengthType.OBJECTIVE:
				return 'OBJECTIVE';
			case LengthType.SHORT:
				return 'SHORT';
			case LengthType.BRIEF:
				return 'BRIEF';
			case LengthType.LONG:
				return 'LONG';
		}
	}

	getDifficultyDesc(level: DifficultyType) {
		switch (level) {
			case DifficultyType.EASY:
				return 'EASY';
			case DifficultyType.MEDIUM:
				return 'MEDIUM';
			case DifficultyType.HARD:
				return 'HARD';
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
