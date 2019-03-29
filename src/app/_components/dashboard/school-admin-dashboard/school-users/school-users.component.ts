import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { User } from 'src/app/_models/user.model';
import { RoleType } from 'src/app/_models/enums';

@Component({
	selector: 'app-school-users',
	templateUrl: './school-users.component.html',
	styleUrls: [ './school-users.component.css' ]
})
export class SchoolUsersComponent implements OnInit {
	users: User[];
	selectedUser: User;
	selectedRole = -1;
	constructor(private userService: UserService, private localStorageService: LocalStorageService) {}

	ngOnInit() {
		this.userService
			.getUsersBySchoolId(this.localStorageService.getCurrentUser().school.schoolId)
			.subscribe((users: User[]) => {
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
					this.selectedUser = null;
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
						this.selectedUser = null;
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
}
