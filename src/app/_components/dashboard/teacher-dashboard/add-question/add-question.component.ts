import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { User } from 'src/app/_models/user.model';
import { Subject } from 'src/app/_models/subject.model';
import { RoleType } from 'src/app/_models/enums';
import { Standard } from 'src/app/_models/standard.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { Question, Contributer } from 'src/app/_models/question.model';
import { School } from 'src/app/_models/school.model';
import { QuestionRequestService } from 'src/app/_services/questionRequest.service';
import { UtilityService } from 'src/app/_services/utility.service';
import { QuestionCriteria } from 'src/app/_dto/question-criteria.dto';
import { QuestionService } from 'src/app/_services/question.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Quill } from 'quill';

@Component({
	selector: 'app-add-question',
	templateUrl: './add-question.component.html',
	styleUrls: [ './add-question.component.css' ]
})
export class AddQuestionComponent implements OnInit {
	lastSearchTerm: string;
	loggedInUser: User;
	stdSubjectMap = new Map<number, Subject[]>();
	standards: Standard[];
	question = new Question();
	selectedStd = -1;
	selectedSubject: Subject = null;
	tags = '';
	suggestedQuestions: Question[];
	constructor(
		private localStorageService: LocalStorageService,
		private notificationService: NotificationService,
		private quesRequestService: QuestionRequestService,
		private utilityService: UtilityService,
		private quesService: QuestionService
	) {}
	@ViewChild('container1') container: ElementRef;

	ngOnInit() {
		// var cbVal = document.getElementById('testing');
		// var quill = new Quill(cbVal);
		this.loggedInUser = this.localStorageService.getCurrentUser();
		var teacherRole = this.loggedInUser.roles[
			this.utilityService.findRoleIndex(this.loggedInUser.roles, RoleType.TEACHER)
		];
		this.createSubjectReviewerMap(teacherRole.stds);
	}

	createSubjectReviewerMap(stds: Standard[]) {
		this.standards = stds;
		stds.forEach((std: Standard) => {
			this.stdSubjectMap.set(std.std, std.subjects);
		});
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
		this.quesRequestService.addQuestion(this.question).subscribe((response) => {
			this.question.title = '';
			this.question.imageUrl = '';
			// this.resetForm();
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
	getSuggestions(event) {
		var searchTerm = this.question.title ? this.question.title.trim() : '';
		if (event.keyCode !== 32) {
			if (searchTerm.length < 3) {
				this.suggestedQuestions = [];
				this.lastSearchTerm = '';
			}
			return;
		}

		if (searchTerm.length > 2 && this.lastSearchTerm !== searchTerm) {
			var questionCriteria = new QuestionCriteria(
				this.loggedInUser.school.group.code,
				this.selectedStd,
				this.selectedSubject.title,
				searchTerm
			);
			this.quesService.getSuggestions(questionCriteria).subscribe((questions: Question[]) => {
				this.suggestedQuestions = questions;
				this.lastSearchTerm = searchTerm;
			});
		}
	}
}
