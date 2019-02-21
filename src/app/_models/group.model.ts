import { Question } from './question.model';
import { User } from './user.model';
import { Subject } from './subject.model';

export class Group {
	groupId: string;
	code: string;
	quesCategories: string[];
	auxQuestions: Question[];
	createDate: Date;
	lastModifiedDate: Date;
	admin: User;
	subjects: Subject[];

	constructor(code?: string) {
		this.code = code;
	}
}
