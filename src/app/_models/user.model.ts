import { Role } from "./role.model";
import { School } from "./school.model";

export class User {

    constructor(public userId: string, public fullName: string, public mobile: string, public password: string,
        public gender: string, public email: string, public dob: Date, public school: School, public prevSchools: School[], public roles: Role[],
        public createDate: Date, public lastModifiedDate: Date) {
    }


}