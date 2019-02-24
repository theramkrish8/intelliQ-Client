import { Role } from './role.model';
import { School } from './school.model';

export class User {
	public userId: string;
	public name: string;
	public userName: string;
	public gender: string;
	public mobile: string;
	public email: string;
	public password: string;
	public dob: Date;
	public createDate: Date;
	public lastModifiedDate: Date;
	public school: School;
	public prevSchools: School[];
	public roles: Role[];

	constructor() {}
}
