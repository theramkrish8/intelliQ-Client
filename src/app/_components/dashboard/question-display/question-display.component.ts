import { Component, OnInit, Input } from '@angular/core';
import { QuestionStatus } from 'src/app/_models/enums';
import { Question } from 'src/app/_models/question.model';

@Component({
	selector: 'app-question-display',
	templateUrl: './question-display.component.html',
	styleUrls: [ './question-display.component.css' ]
})
export class QuestionDisplayComponent implements OnInit {
	// tslint:disable-next-line:no-input-rename
	@Input('selectedQues') selectedQuestion: Question;
	@Input() header: string;
	constructor() {}

	ngOnInit() {}
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
}
