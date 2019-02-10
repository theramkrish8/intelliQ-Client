import { RoleType } from "./enums";
import { Standard } from "./standard.model";

export class Role {
    constructor(public type: RoleType, public std: Standard[]) {

    }

}