import { RestService } from './rest.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class QuestionService {
	constructor(private restService: RestService, private localStorageService: LocalStorageService) {}

	getAllQuestions() {
		return this.restService.get('question.json', null);
	}
	getMyQuestions() {
		return this.restService.get('question.json', null).pipe(
			map((data) => {
				var userId = this.localStorageService.getCurrentUser().userId;
				var myQuestions = data.filter(function(el) {
					return el.owner === userId;
				});
				return myQuestions;
			})
		);
	}
}
