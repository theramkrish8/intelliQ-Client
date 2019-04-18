import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { Standard } from 'src/app/_models/standard.model';
import { Subject } from 'src/app/_models/subject.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { UtilityService } from 'src/app/_services/utility.service';
import { RoleType, LengthType, DifficultyType } from 'src/app/_models/enums';
import { GroupService } from 'src/app/_services/group.service';
import { Group } from 'src/app/_models/group.model';
import { QuesLength, QuestionCriteria, QuesDifficulty } from 'src/app/_dto/question-criteria.dto';
import { QuestionPaperService } from 'src/app/_services/question-paper.service';
import { QuestionPaperDto, Section } from 'src/app/_dto/question-paper.dto';
import { NotificationService } from 'src/app/_services/notification.service';
import { TestDto } from 'src/app/_dto/test.dto.';
import { TestPaper } from 'src/app/_models/testpaper.model';
import { Template } from 'src/app/_models/template.model';
import { Observable } from 'rxjs';
import { Question } from 'src/app/_models/question.model';
import { QuestionService } from 'src/app/_services/question.service';

@Component({
	selector: 'app-generate-paper',
	templateUrl: './generate-paper.component.html',
	styleUrls: [ './generate-paper.component.css' ]
})
export class GeneratePaperComponent implements OnInit {
	loadedTemplate: Template;
	loadedDraft: TestPaper;
	selectedDraft = '';
	selectedTemplateId = '';
	templatesArray: Template[];
	draftsArray: TestPaper[];
	modalTag = '';
	showModal = false;
	showReplaceModal = false;
	activeTab = 'criteria';
	questionPapers: QuestionPaperDto[];
	userGroup: Group;
	loggedInUser: User;
	stdSubjectMap = new Map<number, Subject[]>();
	subjectMap = new Map<string, Subject>();
	standards: Standard[];
	selectedStd = -1;
	selectedSubject: Subject = null;
	sets = 1;
	totalMarks: number;
	selectedSections: { type: string; totalQues: number; marks: number }[];
	activeSet = 1;
	questionToReplace: {
		quesId: string;
		std: number;
		subject: string;
		topic: string;
		difficulty: QuesDifficulty;
		length: QuesLength[];
		tags: string[];
		sectionIndex: number;
		questionIndex: number;
	} = {
		quesId: '',
		std: 0,
		subject: '',
		topic: '',
		difficulty: null,
		length: [],
		tags: [],
		sectionIndex: 0,
		questionIndex: 0
	};
	questions: Question[] = [];
	selectedReplacement: Question = null;
	difficultyLevels = [
		{ type: 'EASY', checked: false, diffPercent: null },
		{ type: 'MEDIUM', checked: false, diffPercent: null },
		{ type: 'HARD', checked: false, diffPercent: null }
	];
	allSections = [
		{ type: 'OBJECTIVE', totalQues: null, marks: null },
		{ type: 'SHORT', totalQues: null, marks: null },
		{ type: 'BRIEF', totalQues: null, marks: null },
		{ type: 'LONG', totalQues: null, marks: null }
	];
	topics: string[];
	currSet: QuestionPaperDto;
	queCriteria: QuestionCriteria;
	testPaperStatus = 'draft';
	replaceCriteriaModel: { type: string; totalQues: number; marks: number };

	constructor(
		private notificationService: NotificationService,
		private localStorageService: LocalStorageService,
		private groupService: GroupService,
		private utilityService: UtilityService,
		private questionPaperService: QuestionPaperService,
		private questionService: QuestionService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		var teacherRole = this.loggedInUser.roles[
			this.utilityService.findRoleIndex(this.loggedInUser.roles, RoleType.TEACHER)
		];
		this.createSubjectReviewerMap(teacherRole.stds);
		this.fetchGroup();
		this.fetchDraftsAndTemplates();
	}

	createSubjectReviewerMap(stds: Standard[]) {
		this.standards = stds;
		stds.forEach((std: Standard) => {
			this.stdSubjectMap.set(std.std, std.subjects);
		});
	}

	fetchGroup() {
		if (!this.userGroup) {
			this.groupService.getGroupByCode(this.loggedInUser.school.group.code).subscribe((group: Group) => {
				this.userGroup = group;
				if (this.userGroup) {
					this.createSubjectTopicMap(group);
				}
			});
		}
	}

	createSubjectTopicMap(group: Group) {
		group.subjects.forEach((subject: Subject) => {
			this.subjectMap.set(subject.title, subject);
		});
	}

	generatePaper() {
		this.createQuestionCriteria();
		this.questionPaperService
			.generateQuestionPaper(this.queCriteria)
			.subscribe((questionPapers: QuestionPaperDto[]) => {
				if (!questionPapers) {
					this.notificationService.showErrorWithTimeout(
						'Oops! No Questions found matching your criteria.',
						null,
						2000
					);
				} else {
					this.activeTab = 'showPaper';
					this.activeSet = 1;
					this.questionPapers = questionPapers.sort((a, b) => {
						return a.set - b.set;
					});
					this.questionPapers.forEach((set: QuestionPaperDto) => {
						set.sections = set.sections.sort((a, b) => {
							return a.type - b.type;
						});
					});
					this.currSet = this.questionPapers[0];
				}
				this.loadedTemplate = null;
				this.loadedDraft = null;
				this.selectedDraft = '';
				this.activeSet = 1;
			});
	}
	createQuestionCriteria() {
		this.queCriteria = new QuestionCriteria(
			this.loggedInUser.school.group.code,
			this.selectedStd,
			this.selectedSubject.title,
			null
		);
		this.queCriteria.sets = Number(this.sets);
		this.queCriteria.totalMarks = this.totalMarks;
		this.queCriteria.topics = this.topics.sort();
		this.queCriteria.length = [];
		if (this.selectedSections) {
			this.selectedSections.forEach((section) => {
				var sec = new QuesLength();
				sec.type = this.utilityService.getLengthEnum(section.type);
				sec.count = section.totalQues;
				sec.marks = section.marks;
				this.queCriteria.length.push(sec);
			});
		}
		this.queCriteria.difficulty = [];
		this.difficultyLevels.forEach((level) => {
			if (level.checked) {
				var lvl = new QuesDifficulty();
				lvl.level = this.utilityService.getDifficultyEnum(level.type);
				lvl.percent = level.diffPercent;
				this.queCriteria.difficulty.push(lvl);
			}
		});
	}

	getActiveTabClass(set: number) {
		return set === this.activeSet;
	}

	onSetSelected(set: number) {
		this.activeSet = set;
		this.currSet = this.questionPapers[set - 1];
	}
	saveData() {
		if (this.activeTab === 'criteria') {
			this.saveTemplate();
		} else {
			this.saveTestPaper();
		}
	}
	saveTemplate() {
		this.createQuestionCriteria();
		var template = null;
		if (this.queCriteria) {
			if (this.loadedTemplate) {
				template = this.loadedDraft;
			} else {
				template = new Template(this.loggedInUser);
			}
			template.criteria = this.queCriteria;
			template.tag = this.modalTag;
		}
		var testDto = new TestDto(template, null);
		this.questionPaperService.savePaper(testDto, this.testPaperStatus).subscribe((response: String) => {
			if (response) {
				var msgs = response.split(':');
				if (msgs[0] === 'Duplicate Record') {
					this.notificationService.showErrorWithTimeout('Template already exists!', null, 2000);
				} else {
					this.notificationService.showSuccessWithTimeout(msgs[0], null, 2000);
					this.fetchAllTemplates();
				}
			}
			this.showModal = false;
		});
	}

	saveTestPaper() {
		var testPaper: TestPaper;
		if (this.loadedDraft) {
			testPaper = this.loadedDraft;
			testPaper.tag = this.modalTag;
			testPaper.sets = this.questionPapers;
		} else {
			if (this.questionPapers) {
				testPaper = new TestPaper(this.loggedInUser);
				testPaper.std = this.selectedStd;
				testPaper.subject = this.selectedSubject.title;
				testPaper.sets = this.questionPapers;
				testPaper.tag = this.modalTag;
			}
		}
		var testDto = new TestDto(null, testPaper);
		this.questionPaperService.savePaper(testDto, this.testPaperStatus).subscribe((response: String) => {
			if (response) {
				var msgs = response.split(':');
				this.notificationService.showSuccessWithTimeout(msgs[1], null, 2000);
				this.fetchAllDrafts();
			}
			this.showModal = false;
		});
	}
	fetchDraftsAndTemplates() {
		this.fetchAllTemplates();
		this.fetchAllDrafts();
	}
	fetchAllTemplates() {
		this.questionPaperService
			.fetchTemplates(this.loggedInUser.school.group.code, this.loggedInUser.userId)
			.subscribe((templates) => {
				this.templatesArray = templates;
			});
	}
	fetchAllDrafts() {
		this.questionPaperService
			.fetchDrafts(this.loggedInUser.school.group.code, this.loggedInUser.userId)
			.subscribe((templates) => {
				this.draftsArray = templates;
			});
	}
	fetchDraft() {
		this.questionPaperService
			.fetchDraft(this.loggedInUser.school.group.code, this.selectedDraft)
			.subscribe((draft: TestPaper) => {
				if (draft) {
					this.loadedDraft = draft;
					this.questionPapers = draft.sets.sort((a, b) => {
						return a.set - b.set;
					});
					this.questionPapers.forEach((set: QuestionPaperDto) => {
						set.sections = set.sections.sort((a, b) => {
							return a.type - b.type;
						});
					});
					this.currSet = this.questionPapers[0];
					this.activeSet = 1;
				}
			});
	}
	fetchTemplate() {
		this.questionPaperService
			.fetchTemplate(this.loggedInUser.school.group.code, this.selectedTemplateId)
			.subscribe((template: Template) => {
				this.loadedTemplate = template;
				this.setTemplateForm();
			});
	}
	setTemplateForm() {
		var template = this.loadedTemplate;
		if (template) {
			this.selectedStd = template.criteria.std;
			this.selectedSubject = this.stdSubjectMap
				.get(this.selectedStd)
				.find((x) => x.title === template.criteria.subject);
			this.sets = template.criteria.sets;
			this.totalMarks = template.criteria.totalMarks;
			this.topics = template.criteria.topics;
			this.selectedSections = [];
			template.criteria.length.forEach((section: QuesLength) => {
				this.selectedSections.push({
					type: this.utilityService.getSectionDesc(section.type),
					totalQues: section.count,
					marks: section.marks
				});
			});

			this.difficultyLevels = [
				{ type: 'EASY', checked: false, diffPercent: null },
				{ type: 'MEDIUM', checked: false, diffPercent: null },
				{ type: 'HARD', checked: false, diffPercent: null }
			];
			template.criteria.difficulty.forEach((difficulty: QuesDifficulty) => {
				this.difficultyLevels[difficulty.level].checked = true;
				this.difficultyLevels[difficulty.level].diffPercent = difficulty.percent;
			});
			this.allSections = [
				{ type: 'OBJECTIVE', totalQues: null, marks: null },
				{ type: 'SHORT', totalQues: null, marks: null },
				{ type: 'BRIEF', totalQues: null, marks: null },
				{ type: 'LONG', totalQues: null, marks: null }
			];
			this.selectedSections.forEach((section) => {
				var index = this.allSections.findIndex((x) => x.type === section.type);
				this.allSections[index] = section;
			});
		}
	}
	resetTemplateForm() {
		this.allSections = [
			{ type: 'OBJECTIVE', totalQues: null, marks: null },
			{ type: 'SHORT', totalQues: null, marks: null },
			{ type: 'BRIEF', totalQues: null, marks: null },
			{ type: 'LONG', totalQues: null, marks: null }
		];
		this.difficultyLevels = [
			{ type: 'EASY', checked: false, diffPercent: null },
			{ type: 'MEDIUM', checked: false, diffPercent: null },
			{ type: 'HARD', checked: false, diffPercent: null }
		];
		this.loadedTemplate = null;
		this.selectedTemplateId = '';
		this.selectedStd = -1;
		this.selectedSubject = null;
		this.sets = 1;
		this.totalMarks = null;
		this.selectedSections = [];
		this.topics = [];
		this.queCriteria = null;
	}
	replaceClicked(pIndex: number, cIndex: number, question: Question) {
		if (this.loadedDraft) {
			this.questionToReplace.std = this.loadedDraft.std;
			this.questionToReplace.subject = this.loadedDraft.subject;
		} else {
			this.questionToReplace.std = this.selectedStd;
			this.questionToReplace.subject = this.selectedSubject.title;
		}
		this.questionToReplace.difficulty = new QuesDifficulty();
		this.questionToReplace.difficulty.level = question.difficulty;
		var queLength = new QuesLength();
		queLength.type = question.length; // count?
		this.questionToReplace.length = [ queLength ];
		this.questionToReplace.sectionIndex = pIndex;
		this.questionToReplace.questionIndex = cIndex;
		this.questionToReplace.quesId = question.quesId;
		this.questions = [];
		this.selectedReplacement = null;
		this.showReplaceModal = true;
	}
	replaceQuestion() {
		if (!this.selectedReplacement) {
			var queCriteria = new QuestionCriteria(
				this.loggedInUser.school.group.code,
				this.questionToReplace.std,
				this.questionToReplace.subject,
				null
			);
			queCriteria.difficulty = [ this.questionToReplace.difficulty ];
			queCriteria.length = this.questionToReplace.length;
			queCriteria.tags = this.questionToReplace.tags;
			queCriteria.topics = [ this.questionToReplace.topic ];
			this.questionService.getFilteredQuestion(queCriteria).subscribe((questions: Question[]) => {
				questions = questions.filter((x) => x.quesId !== this.questionToReplace.quesId);
				if (questions.length > 0) {
					this.questions = questions;
				} else {
					this.notificationService.showErrorWithTimeout(
						'Oops! No Questions found matching your criteria.',
						null,
						2000
					);
				}
			});
		} else {
			this.questionPapers[this.activeSet - 1].sections[this.questionToReplace.sectionIndex].questions[
				this.questionToReplace.questionIndex
			] = this.selectedReplacement;
			this.notificationService.showSuccessWithTimeout('Question replaced!', null, 2000);
			this.showReplaceModal = false;
		}
	}
	showModalForm(type: string) {
		if (type === 'template') {
			this.modalTag = this.loadedTemplate ? this.loadedTemplate.tag : '';
		} else {
			this.modalTag = this.loadedDraft ? this.loadedDraft.tag : '';
		}
		this.showModal = true;
	}
}
