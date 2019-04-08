import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/_models/question.model';

@Component({
	selector: 'app-question-display',
	templateUrl: './question-display.component.html',
	styleUrls: [ './question-display.component.css' ]
})
export class QuestionDisplayComponent implements OnInit {
	// tslint:disable-next-line:no-input-rename
	@Input('selectedQues') selectedQuestion: Question;
	@Input() showOwner: boolean;
	@Input() showReviewer: boolean;
	@Input() showSchool: boolean;
	@Input() showCreatedDate: boolean;
	@Input() showLastModifiedDate: boolean;
	@Input() showRejectReason: boolean;
	constructor() {}

	ngOnInit() {}
}
