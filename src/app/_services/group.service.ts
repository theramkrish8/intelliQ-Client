import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { Group } from "../_models/group.model";

@Injectable()
export class GroupService {

    constructor(private restService: RestService) { }

    addGroup(group: Group) {
        return this.restService.post("group/add", group);
        // return this.restService.get("group/all/0", null);
    }

}