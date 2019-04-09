import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { QuestionRequestService } from 'src/app/_services/questionRequest.service';
import { QuesRequest } from 'src/app/_dto/ques-request.dto';
import { UtilityService } from 'src/app/_services/utility.service';
import { RoleType, QuestionStatus } from 'src/app/_models/enums';
import { Question } from 'src/app/_models/question.model';
import { Observable } from 'rxjs';
import { Standard } from 'src/app/_models/standard.model';
import { Subject } from 'src/app/_models/subject.model';

@Component({
	selector: 'app-view-requests',
	templateUrl: './view-requests.component.html',
	styleUrls: [ './view-requests.component.css' ]
})
export class ViewRequestsComponent implements OnInit {
	isRejected = false;
	loggedInUser: User;
	pendingQuestions$: Observable<Question[]>;
	rejectedQuestions$: Observable<Question[]>;
	selectedQuestion: Question;
	tempSelectedQuestion: Question;
	rejectedPageIndex = 0;
	pendingPageIndex = 0;
	editMode = false;
	tags: string;
	constructor(
		private localStorageService: LocalStorageService,
		private quesRequestService: QuestionRequestService,
		private utilityService: UtilityService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		this.pendingQuestions$ = this.quesRequestService.viewQuestionRequests(
			this.createQuesRequestDto(this.loggedInUser, QuestionStatus.PENDING, this.pendingPageIndex)
		);
		this.rejectedQuestions$ = this.quesRequestService.viewQuestionRequests(
			this.createQuesRequestDto(this.loggedInUser, QuestionStatus.REJECTED, this.rejectedPageIndex)
		);
	}
	createQuesRequestDto(user: User, status: QuestionStatus, pageIndex: number): QuesRequest {
		var quesRequest = new QuesRequest();
		quesRequest.userID = user.userId;
		quesRequest.groupCode = user.school.group.code;
		quesRequest.page = pageIndex;
		quesRequest.schoolID = user.school.schoolId;
		quesRequest.standards = user.roles[this.utilityService.findRoleIndex(user.roles, RoleType.TEACHER)].stds;
		quesRequest.standards.forEach((std: Standard) => {
			std.subjects.forEach((subject: Subject) => {
				subject.tags = null;
				subject.topics = null;
				subject.reviewer = null;
			});
		});
		quesRequest.status = status;
		return quesRequest;
	}
	getClassForStatus(status: QuestionStatus) {
		switch (status) {
			case QuestionStatus.NEW:
				return 'panel panel-info';
			case QuestionStatus.TRANSIT:
				return 'panel panel-warning';
			case QuestionStatus.REMOVE:
				return 'panel panel-danger';
			case QuestionStatus.REJECTED:
				return 'panel panel-danger';
		}
	}
	onRejectedTabClick() {
		this.editMode = false;
		this.selectedQuestion = null;
		this.isRejected = true;
	}
	deleteQuestion() {
		this.quesRequestService.deleteQuestionRequest(this.selectedQuestion).subscribe((response) => {
			if (response) {
				document.getElementById(this.selectedQuestion.quesId).hidden = true;
				this.selectedQuestion = null;
			}
		});
	}
	onEditClicked() {
		this.editMode = true;
		this.tempSelectedQuestion = this.selectedQuestion;
		this.tags = this.tempSelectedQuestion.tags ? this.tempSelectedQuestion.tags.toString() : '';
	}
	updateQuestion() {
		this.tempSelectedQuestion.tags = this.tags.split(',');
		this.quesRequestService.updateQuestion(this.tempSelectedQuestion).subscribe((response) => {
			if (response) {
				document.getElementById(this.selectedQuestion.quesId).hidden = true;
				this.selectedQuestion = null;
				this.editMode = false;
			}
		});
	}
}
