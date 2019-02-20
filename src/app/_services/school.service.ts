import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { Group } from "../_models/group.model";
import { map } from "rxjs/operators";
import { AppResponse } from "../_models/app-response.model";
import { UtilityService } from "./utility.service";
import { Observable } from "rxjs";
import { School } from "../_models/school.model";

@Injectable()
export class SchoolService {

    constructor(private restService: RestService, private utilityService: UtilityService) { }

    addSchool(school: School) {
        return this.restService.post("school/add", school).pipe(map((appResponse: AppResponse) => {
            var result = this.utilityService.getAppResponse(appResponse, true, true);
            if (result === null) {
                return null;
            }
            // process result if required and return same
            return result;
        }));

    }

}