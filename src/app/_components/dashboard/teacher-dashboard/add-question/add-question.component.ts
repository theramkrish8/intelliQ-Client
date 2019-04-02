import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { User } from 'src/app/_models/user.model';
import { Subject } from 'src/app/_models/subject.model';
import { RoleType, LengthType } from 'src/app/_models/enums';
import { Role } from 'src/app/_models/role.model';
import { Standard } from 'src/app/_models/standard.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { Question, Contributer } from 'src/app/_models/question.model';
import { School } from 'src/app/_models/school.model';
import { QuestionService } from 'src/app/_services/question.service';

@Component({
	selector: 'app-add-question',
	templateUrl: './add-question.component.html',
	styleUrls: [ './add-question.component.css' ]
})
export class AddQuestionComponent implements OnInit {
	loggedInUser: User;
	stdSubjectMap = new Map<number, Subject[]>();
	standards: Standard[];
	question = new Question();
	selectedStd = -1;
	selectedSubject: Subject = null;
	tags = '';
	constructor(
		private localStorageService: LocalStorageService,
		private notificationService: NotificationService,
		private quesService: QuestionService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		var teacherRole = this.loggedInUser.roles[this.findRoleIndex(this.loggedInUser.roles, RoleType.TEACHER)];
		this.createSubjectReviewerMap(teacherRole.stds);
	}

	createSubjectReviewerMap(stds: Standard[]) {
		this.standards = stds;
		stds.forEach((std: Standard) => {
			this.stdSubjectMap.set(std.std, std.subjects);
		});
	}

	findRoleIndex(roles: Role[], roleType: RoleType) {
		return roles.findIndex((x) => x.roleType === roleType);
	}
	checkReviewer() {
		if (!this.selectedSubject.reviewer.userId) {
			this.notificationService.showErrorWithTimeout(
				'No Reviewer found for ' + this.selectedSubject.title + '.',
				null,
				2000
			);
		}
		this.question = new Question();
		this.tags = '';
	}
	addQuestion() {
		this.question.groupCode = this.loggedInUser.school.group.code;
		this.question.owner = new Contributer(this.loggedInUser.userId, this.loggedInUser.userName);
		this.question.reviewer = new Contributer(
			this.selectedSubject.reviewer.userId,
			this.selectedSubject.reviewer.userName
		);
		this.question.school = this.getSchool(this.loggedInUser.school);
		this.question.tags = this.tags ? this.tags.split(',').map((x) => x.toLowerCase()) : [];
		this.question.std = this.selectedStd;
		this.question.subject = this.selectedSubject.title;
		this.quesService.addQuestion(this.question).subscribe((response) => {
			this.resetForm();
		});
	}

	getSchool(school: School) {
		var scl = new School();
		scl.schoolId = school.schoolId;
		scl.code = school.code;
		scl.shortName = school.shortName;
		scl.address = school.address;
		return scl;
	}
	resetForm() {
		this.question = new Question();
		this.selectedStd = -1;
		this.selectedSubject = null;
		this.tags = '';
	}
}
