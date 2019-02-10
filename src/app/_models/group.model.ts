import { Question } from "./question.model";
import { User } from "./user.model";
import { Subject } from "./subject.model";


export class Group {
    // tslint:disable-next-line:max-line-length
    constructor(private groupId: string, private code: string, private questionCategories: string[],
        private auxQuestions: Question[], private createDate: Date, private lastModifiedDate: Date,
        private admin: User, private subject: Subject) { }

}