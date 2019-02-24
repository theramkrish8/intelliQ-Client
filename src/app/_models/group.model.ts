import { Question } from './question.model';
import { User } from './user.model';
import { Subject } from './subject.model';

export class Group {
	groupId: string;
	code: string;
	quesCategories: string[];
	createDate: Date;
	lastModifiedDate: Date;
	subjects: Subject[];

	constructor(code?: string) {
		this.code = code;
	}
}
