import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilityService } from 'src/app/_services/utility.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { GroupService } from 'src/app/_services/group.service';
import { Subject } from 'src/app/_models/subject.model';
import { Group } from 'src/app/_models/group.model';
import { SchoolService } from 'src/app/_services/school.service';
import { School } from 'src/app/_models/school.model';
import { Role } from 'src/app/_models/role.model';
import { RoleType } from 'src/app/_models/enums';
import { Standard } from 'src/app/_models/standard.model';

@Component({
	selector: 'app-school-upsert-users',
	templateUrl: './school-upsert-users.component.html',
	styleUrls: [ './school-upsert-users.component.css' ]
})
export class SchoolUpsertUsersComponent implements OnInit {
	roleType = '';
	user: User;
	stds: Number[];
	loggedUser: User;
	subjects: Subject[];
	selectedStd = -1;
	userSearchDone = false;
	stdMap = new Map();
	prevMobile = '';
	constructor(
		private utilityService: UtilityService,
		private userService: UserService,
		private localStorageService: LocalStorageService,
		private notificationService: NotificationService,
		private groupService: GroupService,
		private schoolService: SchoolService
	) {
		this.user = new User();
	}
	@ViewChild('mobileTxt') mobileElem: ElementRef;
	ngOnInit() {
		this.loggedUser = this.localStorageService.getCurrentUser();

		this.groupService.getGroupByCode(this.loggedUser.school.group.code).subscribe((group: Group) => {
			if (group) {
				this.subjects = group.subjects;
			}
		});
		var schoolLoc = this.localStorageService.getItemFromLocalStorage('school', true);
		if (schoolLoc) {
			this.stds = schoolLoc.stds;
		}
		this.schoolService.schoolFetched.subscribe((school: School) => {
			this.stds = school.stds;
		});
	}

	onMobileEntered() {
		if (this.prevMobile === this.user.mobile) {
			return;
		}
		this.prevMobile = this.user.mobile;
		if (this.utilityService.isValidMobile(this.user.mobile)) {
			this.userService.getUserByMobile(this.user.mobile).subscribe((user: User) => {
				if (user) {
					if (user.school.schoolId !== this.loggedUser.school.schoolId) {
						this.notificationService.showErrorWithTimeout(
							'User is not part of school ' + this.loggedUser.school.shortName,
							null,
							2000
						);
						this.user = new User();
						this.user.mobile = this.mobileElem.nativeElement.value;
						this.mobileElem.nativeElement.focus();
						this.userSearchDone = false;
					} else {
						this.user = user;
						this.userSearchDone = true;
					}
				} else {
					this.user = new User();
					this.user.mobile = this.mobileElem.nativeElement.value;
					this.userSearchDone = true;
				}
				this.stdMap = new Map();
				this.selectedStd = -1;
			});
		} else {
			this.mobileElem.nativeElement.focus();
		}
	}

	addRemoveSubject(subject) {
		var subArr: Set<Subject>;
		if (this.stdMap.has(this.selectedStd)) {
			subArr = this.stdMap.get(this.selectedStd);
			if (subArr.has(subject)) {
				subArr.delete(subject);
				if (subArr.size === 0) {
					this.stdMap.delete(this.selectedStd);
					return;
				}
			} else {
				subArr.add(subject);
			}
		} else {
			subArr = new Set();
			subArr.add(subject);
		}
		this.stdMap.set(this.selectedStd, subArr);
	}
	getClassForSubject(subject: Subject) {
		if (this.stdMap.has(this.selectedStd) && this.stdMap.get(this.selectedStd).has(subject)) {
			return 'btn-success';
		} else {
			return 'btn-default';
		}
	}
	addUser() {
		var roleType = this.roleType === 'teacher' ? RoleType.TEACHER : RoleType.REVIEWER;
		var role = new Role(roleType);
		this.stdMap.forEach((subjects: Set<Subject>, key: number) => {
			var standard = new Standard(key);
			subjects.forEach((subject: Subject) => {
				standard.subjects.push(subject);
			});

			role.stds.push(standard);
		});
		this.user.roles.push(role);

		if (this.user.userId) {
			this.userService.updateUser(this.user).subscribe((response) => {
				if (response && this.user.userId === this.loggedUser.userId) {
					this.localStorageService.addItemToLocalStorage('user', this.user);
				}
			});
		} else {
			this.userService.addUser(this.user).subscribe();
		}
	}
}
