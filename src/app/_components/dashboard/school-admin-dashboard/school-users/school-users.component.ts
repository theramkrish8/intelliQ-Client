import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { User } from 'src/app/_models/user.model';
import { RoleType } from 'src/app/_models/enums';
import { UtilityService } from 'src/app/_services/utility.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
	selector: 'app-school-users',
	templateUrl: './school-users.component.html',
	styleUrls: [ './school-users.component.css' ]
})
export class SchoolUsersComponent implements OnInit {
	users: User[];
	searchTerm: string;
	selectedRole = -1;
	schoolId: string;
	constructor(
		private userService: UserService,
		private localStorageService: LocalStorageService,
		private utilityService: UtilityService,
		private notificationService: NotificationService
	) {}

	ngOnInit() {
		this.getUsers();
	}
	getUsers() {
		this.schoolId = this.localStorageService.getCurrentUser().school.schoolId;
		this.userService.getUsersBySchoolId(this.schoolId).subscribe((users: User[]) => {
			this.users = users;
		});
	}
	removeUser(user: User) {
		if (this.isAdmin(user)) {
			user.roles = user.roles.filter(
				(role) => role.roleType === RoleType.GROUPADMIN || role.roleType === RoleType.SCHOOLADMIN
			);
			this.userService.updateUser(user).subscribe((response) => {
				if (response) {
					this.users = this.users.filter(function(_user: User) {
						return _user.userId !== user.userId;
					});
				}
			});
		} else {
			this.userService
				.removeUser(this.localStorageService.getCurrentUser().school.schoolId, user.userId)
				.subscribe((response) => {
					if (response) {
						this.users = this.users.filter(function(_user: User) {
							return _user.userId !== user.userId;
						});
					}
				});
		}
	}
	isAdmin(user: User) {
		if (
			user.roles.findIndex(
				(role) => role.roleType === RoleType.GROUPADMIN || role.roleType === RoleType.SCHOOLADMIN
			) > -1
		) {
			return true;
		}
		return false;
	}
	calculateAge(dob: string) {
		if (dob === '0001-01-01T00:00:00Z') {
			return null;
		}
		var dateOfBirth = new Date(dob);
		var diff_ms = Date.now() - dateOfBirth.getTime();
		var age_dt = new Date(diff_ms);

		return Math.abs(age_dt.getUTCFullYear() - 1970);
	}
	searchUser() {
		if (!this.searchTerm) {
			this.getUsers();
			return;
		}
		var isValidMobile = this.utilityService.isValidMobile(this.searchTerm);
		var isValidUserName = this.searchTerm.indexOf('@') > -1;
		var identifier: string;
		if (isValidMobile) {
			identifier = 'mobile';
		} else if (isValidUserName) {
			identifier = 'userName';
		} else {
			this.notificationService.showErrorWithTimeout('Please enter a valid Mobile or UserId!', null, 2000);
			return;
		}
		this.userService.getSchoolUserInfo(this.schoolId, identifier, this.searchTerm).subscribe((user: User) => {
			if (user) {
				this.users = [];
				this.users.push(user);
				this.selectedRole = -1;
			} else {
				this.notificationService.showErrorWithTimeout(
					'No user found with given ' + identifier + '!',
					null,
					2000
				);
			}
		});
	}
}
