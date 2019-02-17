import { Question } from "./question.model";
import { User } from "./user.model";
import { Subject } from "./subject.model";


export class Group {
    groupId: string;
    code: string;
    questionCategories: string[];
    auxQuestions: Question[];
    createDate: Date;
    lastModifiedDate: Date;
    admin: User;
    subject: Subject;


    constructor(code?: string) {
        this.code = code;
    }

}