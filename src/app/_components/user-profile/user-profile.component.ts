import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { Profile } from 'src/app/_dto/profile.dto';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: [ './user-profile.component.css' ]
})
export class UserProfileComponent implements OnInit {
	user: User;
	activeTab = 'profile';
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
	otpGenerated = false;
	otp: string;
	newMobile: string;
	otpSessionId: string;
	firstName: string;
	lastName: string;
	constructor(
		private userService: UserService,
		private localStorageService: LocalStorageService,
		private notificationService: NotificationService
	) {
		this.user = this.localStorageService.getCurrentUser();
		var index = this.user.name.indexOf(' ');
		this.firstName = this.user.name.substring(0, index);
		this.lastName = this.user.name.substring(index + 1);
	}

	ngOnInit() {}
	updateUser() {
		this.user.dob = new Date(this.user.dob);
		this.user.name = this.firstName + ' ' + this.lastName;
		this.userService.updateUser(this.user).subscribe((response) => {
			if (response) {
				this.localStorageService.addItemToLocalStorage('user', this.user);
				this.userService.userDetailsUpdated.next(this.user);
			}
		});
	}
	updatePassword() {
		var profile = new Profile();
		profile.userId = this.user.userId;
		profile.oldPwd = this.oldPassword;
		profile.newPwd = this.newPassword;
		profile.forgotPwd = false;
		this.userService.resetPassword(profile).subscribe((response) => {
			if (response) {
				this.oldPassword = '';
				this.newPassword = '';
				this.confirmPassword = '';
			}
		});
	}

	updateMobile() {
		if (this.otp) {
			this.userService.verifyOtp(this.otp, this.otpSessionId).subscribe((response) => {
				if (response) {
					var profile = new Profile();
					profile.userId = this.user.userId;
					profile.mobile = this.newMobile;
					this.userService.updateMobile(profile).subscribe((res) => {
						if (res) {
							this.user.mobile = this.newMobile;
							this.newMobile = '';
							this.otp = '';
							this.otpGenerated = false;
							this.localStorageService.addItemToLocalStorage('user', this.user);
							this.userService.userDetailsUpdated.next(this.user);
						}
					});
				}
			});
		} else {
			this.userService.generateMobileOtp(this.newMobile).subscribe((response) => {
				if (response) {
					this.notificationService.showSuccessWithTimeout("OTP sent successfully !!", null, 2000);
					this.otpSessionId = response;
					this.otpGenerated = true;
				}
			});
		}
	}
	reset() {
		this.newMobile = '';
		this.otp = '';
		this.otpGenerated = false;
		this.oldPassword = '';
		this.newPassword = '';
		this.confirmPassword = '';
	}
}
