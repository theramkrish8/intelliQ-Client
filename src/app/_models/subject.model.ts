import { User } from './user.model';

export class Subject {
	public reviewerId: string;
	public topics: string[];
	public tags: string[];

	constructor(public title: string) {}
}
