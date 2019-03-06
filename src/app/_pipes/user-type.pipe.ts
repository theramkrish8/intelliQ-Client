import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../_models/user.model';
import { RoleType } from '../_models/enums';

@Pipe({
	name: 'userType'
})
export class UserTypePipe implements PipeTransform {
	transform(users: User[], roleType: RoleType): any {
		roleType = Number(roleType);
		if (!users || roleType === -1) {
			return users;
		}
		// filter items array, items which match and return true will be
		// kept, false will be filtered out
		return users.filter((user: User) => {
			if (user.roles.findIndex((role) => role.roleType === roleType) === -1) {
				return false;
			}
			return true;
		});
	}
}
