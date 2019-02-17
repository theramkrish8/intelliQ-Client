
import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { CommonUtility } from "../_common/common-utility";
import { RoleType } from "../_models/enums";
import { forEach } from "@angular/router/src/utils/collection";

@Injectable()
export class UserService implements OnInit {
    userDetailsUpdated = new Subject();
    constructor(private localStorageService: LocalStorageService) {

    }

    ngOnInit(): void {

    }
    getUserRoles() {
        var user = this.localStorageService.getCurrentUser();
        if (user) {
            var roles = [];
            user.roles.forEach(role => {
                roles.push(CommonUtility.getRoleDescription(role.roleType));
            });
            return roles;
        }
        return null;
    }

}