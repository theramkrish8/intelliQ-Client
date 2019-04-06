import { RestService } from './rest.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Question } from '../_models/question.model';
import { AppResponse } from '../_dto/app-response.model';
import { UtilityService } from './utility.service';

@Injectable()
export class QuestionService {
	constructor(private restService: RestService, private utilityService: UtilityService) {}
}
