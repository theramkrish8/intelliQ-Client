import { RestService } from './rest.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class QuestionService {
	constructor(private restService: RestService, private localStorageService: LocalStorageService) {}
}
