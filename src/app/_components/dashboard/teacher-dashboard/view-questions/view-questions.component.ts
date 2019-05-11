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
import { QuestionResponseDto } from 'src/app/_dto/question-response.dto';

@Component({
	selector: 'app-view-questions',
	templateUrl: './view-questions.component.html',
	styleUrls: [ './view-questions.component.css' ]
})
export class ViewQuestionsComponent implements OnInit {
	imageUrl: string;
	tempImageUrl = '';
	subjectMap = new Map<string, Subject>();
	isAllQuestions = false;
	loggedInUser: User;
	userQuestions: Question[];
	allQuestions: Question[];
	selectedQuestion: Question;
	tempSelectedQuestion: Question;
	userPageIndex = 1;
	userQuestionsLen: number;
	allPageIndex = 1;
	allQuestionsLen: number;
	editMode = false;
	tags: string;
	pageSize = 10;
	topicsSuggestions: string[];
	chaptersSuggestions: string[];
	quillHtml: string;
	toolbarOptions = [
		[ 'bold', 'italic', 'underline' ], // toggled buttons
		[ 'code-block' ],

		[ { list: 'ordered' }, { list: 'bullet' } ],
		[ { script: 'sub' }, { script: 'super' } ], // superscript/subscript

		[ { size: [ 'small', false, 'large', 'huge' ] } ], // custom dropdown

		[ { align: [] } ],

		[ 'clean' ] // remove formatting button
	];
	quillModule = {
		toolbar: this.toolbarOptions
	};
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
		this.groupService.groupFetched.subscribe((group: Group) => {
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
		this.topicsSuggestions = this.subjectMap.get(this.selectedQuestion.subject).tags;
		this.chaptersSuggestions = this.subjectMap.get(this.selectedQuestion.subject).topics;
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
					this.topicsSuggestions = this.topicsSuggestions.filter((x) => x !== this.tags);
					this.tags = '';
				} else if (event.type === 'blur') {
					//blur
					this.tags = this.tags.trim();
					this.tempSelectedQuestion.tags.push(this.tags);
					this.topicsSuggestions = this.topicsSuggestions.filter((x) => x !== this.tags);
					this.tags = '';
				}
			}
		}
	}
	removeTag(tag) {
		this.tempSelectedQuestion.tags = this.tempSelectedQuestion.tags.filter((x) => x !== tag);
		this.topicsSuggestions.push(tag);
	}
	getMyQuestions() {
		var getCount = this.userQuestionsLen ? false : true;
		this.quesRequestService
			.viewQuestionRequests(
				this.createQuesRequestDto(this.loggedInUser, QuestionStatus.APPROVED, this.userPageIndex - 1, getCount)
			)
			.subscribe((questionResponseDto: QuestionResponseDto) => {
				this.userQuestions = questionResponseDto.questions;
				if (getCount) {
					this.userQuestionsLen = questionResponseDto.records;
				}
			});
	}
	getAllQuestions() {
		var getCount = this.allQuestionsLen ? false : true;
		this.quesService
			.viewAllApprovedQuestion(
				this.createQuesRequestDto(this.loggedInUser, QuestionStatus.APPROVED, this.allPageIndex - 1, getCount)
			)
			.subscribe((questionResponseDto: QuestionResponseDto) => {
				this.allQuestions = questionResponseDto.questions;
				if (getCount) {
					this.allQuestionsLen = questionResponseDto.records;
				}
			});
	}

	createQuesRequestDto(user: User, status: QuestionStatus, pageIndex: number, getCount: boolean): QuesRequest {
		var quesRequest = new QuesRequest();
		quesRequest.userID = user.userId;
		quesRequest.groupCode = user.school.group.code;
		quesRequest.page = pageIndex;
		quesRequest.schoolID = user.school.schoolId;
		quesRequest.standards = user.roles[this.utilityService.findRoleIndex(user.roles, RoleType.TEACHER)].stds;
		quesRequest.status = status;
		quesRequest.getCount = getCount;
		return quesRequest;
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
		this.tempSelectedQuestion = JSON.parse(JSON.stringify(this.selectedQuestion));
		this.tags = '';
		this.quillHtml = this.tempSelectedQuestion.titleHtml;
		this.topicsSuggestions = this.subjectMap.get(this.tempSelectedQuestion.subject).tags;
		this.chaptersSuggestions = this.subjectMap.get(this.tempSelectedQuestion.subject).topics;
	}
	updateQuestion() {
		var text = document.getElementById('quillContainer').textContent;
		this.tempSelectedQuestion.title = text ? text.trim() : '';
		this.tempSelectedQuestion.titleHtml = this.quillHtml;
		if (this.tempImageUrl) {
			this.tempSelectedQuestion.imageUrl = this.tempImageUrl;
		}
		this.quesRequestService.updateQuestion(this.tempSelectedQuestion).subscribe((response) => {
			if (response) {
				this.selectedQuestion = null;
				this.editMode = false;
			}
		});
	}

	getOwner(question: Question) {
		if (this.loggedInUser.school.code === question.school.code) {
			return question.owner.userName;
		}
		return question.school.shortName + ', ' + question.school.address.city;
	}
}
