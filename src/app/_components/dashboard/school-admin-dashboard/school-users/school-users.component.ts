import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { User } from 'src/app/_models/user.model';

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
	removeUser(userID) {
		this.userService
			.removeUser(this.localStorageService.getCurrentUser().school.schoolId, userID)
			.subscribe((response) => {
				if (response) {
					this.users = this.users.filter(function(user: User) {
						return user.userId !== userID;
					});
					this.selectedUser = null;
				}
			});
	}
}
