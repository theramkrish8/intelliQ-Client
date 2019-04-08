import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { QuestionRequestService } from 'src/app/_services/questionRequest.service';
import { QuesRequest } from 'src/app/_dto/ques-request.dto';
import { UtilityService } from 'src/app/_services/utility.service';
import { RoleType, QuestionStatus } from 'src/app/_models/enums';
import { Question } from 'src/app/_models/question.model';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
	selector: 'app-review-requests',
	templateUrl: './review-requests.component.html',
	styleUrls: [ './review-requests.component.css' ]
})
export class ReviewRequestsComponent implements OnInit {
	showRejectReason = false;
	rejectReason: string;
	loggedInUser: User;
	pendingRequests$: Observable<Question[]>;
	selectedQuestion: Question;
	originalQuestion: Question;
	pageIndex = 0;
	compareMode = false;
	constructor(
		private localStorageService: LocalStorageService,
		private quesRequestService: QuestionRequestService,
		private utilityService: UtilityService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		this.pendingRequests$ = this.quesRequestService.viewReviewerRequests(
			this.createQuesRequestDto(this.loggedInUser, QuestionStatus.PENDING, this.pageIndex)
		);
	}
	createQuesRequestDto(user: User, status: QuestionStatus, pageIndex: number): QuesRequest {
		var quesRequest = new QuesRequest();
		quesRequest.userID = user.userId;
		quesRequest.groupCode = user.school.group.code;
		quesRequest.page = pageIndex;
		quesRequest.schoolID = user.school.schoolId;
		quesRequest.standards = user.roles[this.utilityService.findRoleIndex(user.roles, RoleType.TEACHER)].stds;
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
			case QuestionStatus.APPROVED:
				return 'panel panel-success';
		}
	}

	approveRequest() {
		this.quesRequestService.approveQuestionRequest(this.selectedQuestion).subscribe((response) => {
			if (response) {
				document.getElementById(this.selectedQuestion.quesId).hidden = true;
				this.selectedQuestion = null;
			}
		});
	}

	rejectRequest() {
		this.showRejectReason = true;
		if (!this.rejectReason) {
			return;
		}
		this.selectedQuestion.rejectDesc = this.rejectReason;
		this.quesRequestService.rejectQuestionRequest(this.selectedQuestion).subscribe((response) => {
			if (response) {
				document.getElementById(this.selectedQuestion.quesId).hidden = true;
				this.selectedQuestion = null;
				this.showRejectReason = false;
				this.rejectReason = '';
			}
		});
	}

	compareRequest() {
		this.quesRequestService.fetchQuestion(this.selectedQuestion.groupCode,
			this.selectedQuestion.originId).subscribe((response) => {
			if (response) {
				this.compareMode = true;
				this.originalQuestion = response;
			}else{
				alert("Original Question has been removed !!");
			}
		});
	}
	

	onQuestionChanged(question: Question) {
		this.selectedQuestion = question;
		this.compareMode = false;
		this.showRejectReason = false;
		this.rejectReason = '';
	}
}
