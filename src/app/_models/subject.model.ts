import { User } from './user.model';

export class Subject {
	constructor(private title: string, private approver: User, topics: string[]) {}
}
