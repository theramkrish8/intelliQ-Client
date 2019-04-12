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
import { QuestionPaperDto } from 'src/app/_dto/question-paper.dto';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
	selector: 'app-generate-paper',
	templateUrl: './generate-paper.component.html',
	styleUrls: [ './generate-paper.component.css' ]
})
export class GeneratePaperComponent implements OnInit {
	showCriteria = true;
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
	sections: string[];
	activeSet = 1;
	difficultyLevels = [ 'EASY', 'MEDIUM', 'HARD' ];
	topics: string[];
	currSet: QuestionPaperDto;

	constructor(
		private notificationService: NotificationService,
		private localStorageService: LocalStorageService,
		private groupService: GroupService,
		private utilityService: UtilityService,
		private questionPaperService: QuestionPaperService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		var teacherRole = this.loggedInUser.roles[
			this.utilityService.findRoleIndex(this.loggedInUser.roles, RoleType.TEACHER)
		];
		this.createSubjectReviewerMap(teacherRole.stds);
		this.fetchGroup();
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
					this.createSample();
				}
			});
		}
	}
	createSample() {
		this.selectedStd = 4;
		this.selectedSubject = this.stdSubjectMap.get(this.selectedStd)[0];
		this.sets = 3;
		this.totalMarks = 100;
		this.topics = this.subjectMap.get(this.selectedSubject.title).topics;
		this.sections = [ 'OBJECTIVE', 'SHORT', 'BRIEF', 'LONG' ];
	}
	createSubjectTopicMap(group: Group) {
		group.subjects.forEach((subject: Subject) => {
			this.subjectMap.set(subject.title, subject);
		});
	}

	generatePaper() {
		var queCriteria = new QuestionCriteria(
			this.loggedInUser.school.group.code,
			this.selectedStd,
			this.selectedSubject.title,
			null
		);
		queCriteria.sets = Number(this.sets);
		queCriteria.topics = this.topics.sort();
		queCriteria.length = [];
		this.sections.forEach((section: string) => {
			var sec = new QuesLength();
			sec.type = this.getLengthEnum(section);
			sec.count = (document.getElementById('count_' + section) as HTMLInputElement).valueAsNumber;
			sec.marks = (document.getElementById('marks_' + section) as HTMLInputElement).valueAsNumber;
			queCriteria.length.push(sec);
		});
		queCriteria.difficulty = [];
		this.difficultyLevels.forEach((level: string) => {
			if ((document.getElementById('cb_' + level) as HTMLInputElement).checked) {
				var lvl = new QuesDifficulty();
				lvl.level = this.getDifficultyEnum(level);
				lvl.percent = (document.getElementById('cbVal_' + level) as HTMLInputElement).valueAsNumber;
				queCriteria.difficulty.push(lvl);
			}
		});
		this.questionPaperService.generateQuestionPaper(queCriteria).subscribe((questionPapers: QuestionPaperDto[]) => {
			if (!questionPapers) {
				this.notificationService.showErrorWithTimeout(
					'Oops! No Questions found matching your criteria.',
					null,
					2000
				);
			} else {
				this.showCriteria = false;
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
		});
	}

	getLengthEnum(section: string) {
		switch (section) {
			case 'OBJECTIVE':
				return LengthType.OBJECTIVE;
			case 'SHORT':
				return LengthType.SHORT;
			case 'BRIEF':
				return LengthType.BRIEF;
			case 'LONG':
				return LengthType.LONG;
		}
	}
	getDifficultyEnum(difficultyLevel: string) {
		switch (difficultyLevel) {
			case 'EASY':
				return DifficultyType.EASY;
			case 'MEDIUM':
				return DifficultyType.MEDIUM;
			case 'HARD':
				return DifficultyType.HARD;
		}
	}
	getClassForSection(section: string) {
		switch (section) {
			case 'OBJECTIVE':
				return 'panel panel-info';
			case 'SHORT':
				return 'panel panel-warning';
			case 'BRIEF':
				return 'panel panel-danger';
			case 'LONG':
				return 'panel panel-success';
		}
	}

	getSectionDesc(section: LengthType) {
		switch (section) {
			case LengthType.OBJECTIVE:
				return 'OBJECTIVE';
			case LengthType.SHORT:
				return 'SHORT';
			case LengthType.BRIEF:
				return 'BRIEF';
			case LengthType.LONG:
				return 'LONG';
		}
	}

	getDifficultyDesc(level: DifficultyType) {
		switch (level) {
			case DifficultyType.EASY:
				return 'EASY';
			case DifficultyType.MEDIUM:
				return 'MEDIUM';
			case DifficultyType.HARD:
				return 'HARD';
		}
	}
	onLevelChanged(level: string) {
		var cb = (document.getElementById('cb_' + level) as HTMLInputElement).checked;
		var cbVal = document.getElementById('cbVal_' + level) as HTMLInputElement;
		cbVal.disabled = !cb;
		cbVal.value = '';
	}
	getActiveTabClass(set: number) {
		return set === this.activeSet;
	}

	onSetSelected(set: number) {
		this.activeSet = set;
		this.currSet = this.questionPapers[set - 1];
	}
}
