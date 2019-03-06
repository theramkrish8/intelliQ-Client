import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: [ './user-profile.component.css' ]
})
export class UserProfileComponent implements OnInit {
	user: User;
	constructor(private userService: UserService, private localStorageService: LocalStorageService) {
		this.user = this.localStorageService.getCurrentUser();
	}

	ngOnInit() {}
	updateUser() {
		this.user.dob = new Date(this.user.dob);
		this.userService.updateUser(this.user).subscribe((response) => {
			if (response) {
				this.localStorageService.addItemToLocalStorage('user', this.user);
				this.userService.userDetailsUpdated.next(this.user);
			}
		});
	}
}
