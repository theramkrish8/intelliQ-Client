import { RoleType } from './enums';
import { Standard } from './standard.model';

export class Role {
	constructor(public roleType: RoleType, public std: Standard[]) {}
}
