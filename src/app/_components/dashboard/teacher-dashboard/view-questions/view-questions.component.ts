import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { Question } from 'src/app/_models/question.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { QuestionRequestService } from 'src/app/_services/questionRequest.service';
import { UtilityService } from 'src/app/_services/utility.service';
import { QuestionStatus, RoleType } from 'src/app/_models/enums';
import { QuesRequest } from 'src/app/_dto/ques-request.dto';
import { QuestionService } from 'src/app/_services/question.service';
import { Group } from 'src/app/_models/group.model';
import { Subject } from 'src/app/_models/subject.model';
import { GroupService } from 'src/app/_services/group.service';

@Component({
	selector: 'app-view-questions',
	templateUrl: './view-questions.component.html',
	styleUrls: [ './view-questions.component.css' ]
})
export class ViewQuestionsComponent implements OnInit {
	isAllQuestions = false;
	loggedInUser: User;
	userQuestions: Question[];
	allQuestions: Question[];
	selectedQuestion: Question;
	tempSelectedQuestion: Question;
	userPageIndex = 1;
	userQuestionsLen = 50; // change
	allPageIndex = 1;
	allQuestionsLen = 50;
	editMode = false;
	tags: string;
	pageSize = 20;
	subjectMap = new Map<string, Subject>();
	tagsSuggestions: string[];
	topicsSuggestions: string[];
	constructor(
		private localStorageService: LocalStorageService,
		private quesRequestService: QuestionRequestService,
		private utilityService: UtilityService,
		private quesService: QuestionService,
		private groupService: GroupService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		this.getMyQuestions();
		this.getAllQuestions();
		this.fetchGroup();
	}
	fetchGroup() {
		this.groupService.getGroupByCode(this.loggedInUser.school.group.code).subscribe((group: Group) => {
			if (group) {
				this.createSubjectTopicMap(group);
			}
		});
	}
	createSubjectTopicMap(group: Group) {
		group.subjects.forEach((subject: Subject) => {
			this.subjectMap.set(subject.title, subject);
		});
	}
	getSuggestions() {
		this.tagsSuggestions = this.subjectMap.get(this.selectedQuestion.subject).tags;
		this.topicsSuggestions = this.subjectMap.get(this.selectedQuestion.subject).topics;
		this.tags = '';
	}
	addTag(event) {
		if (this.tags && this.tags.length > 2) {
			{
				if (event.keyCode === 188 || event.keyCode === 13) {
					// normal keypress
					this.tags = this.tags.trim();
					if (this.tags[this.tags.length - 1] === ',') {
						this.tags = this.tags.slice(0, this.tags.length - 1);
					}
					this.tempSelectedQuestion.tags.push(this.tags);
					this.tags = '';
				} else if (event.item) {
					// from typeahead
					this.tempSelectedQuestion.tags.push(this.tags);
					this.tagsSuggestions = this.tagsSuggestions.filter((x) => x !== this.tags);
					this.tags = '';
				} else if (event.type === 'blur') {
					//blur
					this.tags = this.tags.trim();
					this.tempSelectedQuestion.tags.push(this.tags);
					this.tagsSuggestions = this.tagsSuggestions.filter((x) => x !== this.tags);
					this.tags = '';
				}
			}
		}
	}
	removeTag(tag) {
		this.tempSelectedQuestion.tags = this.tempSelectedQuestion.tags.filter((x) => x !== tag);
		this.tagsSuggestions.push(tag);
	}
	getMyQuestions() {
		this.quesRequestService
			.viewQuestionRequests(
				this.createQuesRequestDto(this.loggedInUser, QuestionStatus.APPROVED, this.userPageIndex - 1)
			)
			.subscribe((questions) => {
				this.userQuestions = questions;
			});
	}
	getAllQuestions() {
		this.quesService
			.viewAllApprovedQuestion(
				this.createQuesRequestDto(this.loggedInUser, QuestionStatus.APPROVED, this.allPageIndex - 1)
			)
			.subscribe((questions) => {
				this.allQuestions = questions;
			});
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

	onAllTabClick() {
		this.editMode = false;
		this.selectedQuestion = null;
		this.isAllQuestions = true;
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
		this.tempSelectedQuestion.tags = this.tempSelectedQuestion.tags ? this.tempSelectedQuestion.tags : [];
		//this.tags = this.tempSelectedQuestion.tags ? this.tempSelectedQuestion.tags.toString() : '';
	}
	updateQuestion() {
		//this.tempSelectedQuestion.tags = this.tags.split(',');
		this.quesRequestService.updateQuestion(this.tempSelectedQuestion).subscribe((response) => {
			if (response) {
				this.selectedQuestion = null;
				this.editMode = false;
			}
		});
	}
}
