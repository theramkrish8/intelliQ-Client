import { RestService } from './rest.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppResponse } from '../_dto/app-response.model';
import { UtilityService } from './utility.service';
import { QuestionCriteria } from '../_dto/question-criteria.dto';

@Injectable()
export class QuestionPaperService {
	constructor(private restService: RestService, private utilityService: UtilityService) {}

	generateQuestionPaper(queCriteria: QuestionCriteria) {
		return this.restService.post('paper/generate', queCriteria).pipe(
			map((appResponse: AppResponse) => {
				return this.utilityService.getAppResponse(appResponse, true, false);
			})
		);
	}
}
