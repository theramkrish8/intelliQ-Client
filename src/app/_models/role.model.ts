import { RoleType } from './enums';
import { Standard } from './standard.model';

export class Role {
	public std: Standard[];
	constructor(public roleType: RoleType) {}
}
