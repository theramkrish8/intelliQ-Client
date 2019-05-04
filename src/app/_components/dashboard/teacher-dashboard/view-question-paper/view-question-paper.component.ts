import { Component, OnInit } from '@angular/core';
import { QuestionPaperService } from 'src/app/_services/question-paper.service';
import { User } from 'src/app/_models/user.model';
import { TestPaper } from 'src/app/_models/testpaper.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { QuestionPaperDto } from 'src/app/_dto/question-paper.dto';
import { UtilityService } from 'src/app/_services/utility.service';

@Component({
	selector: 'app-view-question-paper',
	templateUrl: './view-question-paper.component.html',
	styleUrls: [ './view-question-paper.component.css' ]
})
export class ViewQuestionPaperComponent implements OnInit {
	loggedInUser: User;
	papers: TestPaper[];
	loadedPaper: TestPaper;
	activeSet = 1;
	currSet: QuestionPaperDto;
	questionPapers: QuestionPaperDto[];
	constructor(
		private localStorageService: LocalStorageService,
		private utilityService: UtilityService,
		private questionPaperService: QuestionPaperService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		this.fetchAllPapers();
	}
	fetchAllPapers() {
		this.questionPaperService
			.fetchPapers(this.loggedInUser.school.group.code, this.loggedInUser.userId)
			.subscribe((templates) => {
				this.papers = templates;
			});
	}
	fetchPaper(paperId) {
		this.questionPaperService
			.fetchDraft(this.loggedInUser.school.group.code, paperId)
			.subscribe((paper: TestPaper) => {
				if (paper) {
					this.loadedPaper = paper;
					this.questionPapers = paper.sets.sort((a, b) => {
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
	getActiveTabClass(set: number) {
		return set === this.activeSet;
	}
	onSetSelected(set: number) {
		this.activeSet = set;
		this.currSet = this.questionPapers[set - 1];
	}
}
