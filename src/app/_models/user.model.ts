import { Role } from "./role.model";
import { School } from "./school.model";

export class User {

    public userId: string;
    public name: string; public mobile: string; public password: string;
    public gender: string; public email: string; public dob: Date; public school: School; public prevSchools: School[]; public roles: Role[];
    public createDate: Date; public lastModifiedDate: Date;

    constructor() { }

}