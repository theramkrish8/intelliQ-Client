import { Component, OnInit, Input } from '@angular/core';
import { QuestionStatus } from 'src/app/_models/enums';

@Component({
  selector: 'app-question-list-item',
  templateUrl: './question-list-item.component.html',
  styleUrls: ['./question-list-item.component.css']
})
export class QuestionListItemComponent implements OnInit {

  @Input() standard: string;
	@Input() subject: string;
  @Input() title: string;
  @Input() lastModifiedDate: Date;
  @Input() status: QuestionStatus;
  constructor() { }

  ngOnInit() {
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
}
