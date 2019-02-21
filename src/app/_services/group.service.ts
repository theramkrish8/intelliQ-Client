import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Group } from '../_models/group.model';
import { map } from 'rxjs/operators';
import { AppResponse } from '../_models/app-response.model';
import { UtilityService } from './utility.service';
import { Observable } from 'rxjs';

@Injectable()
export class GroupService {
	constructor(private restService: RestService, private utilityService: UtilityService) {}

	addGroup(group: Group) {
		return this.restService.post('group/add', group).pipe(
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
	getGroupByCode(code: String): Observable<Group> {
		return this.restService.get('group/info/code/' + code, null).pipe(
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
}
