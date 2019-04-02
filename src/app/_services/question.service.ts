import { RestService } from './rest.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Question } from '../_models/question.model';
import { AppResponse } from '../_models/app-response.model';
import { UtilityService } from './utility.service';

@Injectable()
export class QuestionService {
	constructor(private restService: RestService, private utilityService: UtilityService) {}

	addQuestion(question: Question) {
		return this.restService.post('question/request/add', question).pipe(
			map((appResponse: AppResponse) => {
				var result = this.utilityService.getAppResponse(appResponse, true, true);
				if (result === null) {
					return null;
				}
				// process result if required and return same
				return result;
			})
		);
	}
}
