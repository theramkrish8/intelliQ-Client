import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Group } from '../_models/group.model';
import { map } from 'rxjs/operators';
import { AppResponse } from '../_models/app-response.model';
import { UtilityService } from './utility.service';
import { Observable } from 'rxjs';
import { School } from '../_models/school.model';

@Injectable()
export class SchoolService {
	constructor(private restService: RestService, private utilityService: UtilityService) {}

	addSchool(school: School) {
		return this.restService.post('school/add', school).pipe(
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

	getSchoolBySchoolCode(schoolCode: string) {
		return this.restService.get('school/info/code/' + schoolCode, null).pipe(
			map((appResponse: AppResponse) => {
				var result = this.utilityService.getAppResponse(appResponse, true, false);
				if (result === null) {
					return null;
				}
				// process result if required and return same
				return result;
			})
		);
	}
	getSchoolByGroupCode(groupCode: string) {
		return this.restService.get('school/all/code/' + groupCode, null).pipe(
			map((appResponse: AppResponse) => {
				var result = this.utilityService.getAppResponse(appResponse, true, false);
				if (result === null) {
					return null;
				}
				// process result if required and return same
				return result;
			})
		);
	}
	getSchoolsByGroupId(groupId: string) {
		return this.restService.get('school/all/_id/' + groupId, null).pipe(
			map((appResponse: AppResponse) => {
				var result = this.utilityService.getAppResponse(appResponse, true, false);
				if (result === null) {
					return null;
				}
				// process result if required and return same
				return result;
			})
		);
	}
	updateSchool(school: School) {
		return this.restService.put('school/update', school).pipe(
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
