import { Address } from "./address.model";
import { Contact } from "./contact.model";
import { Group } from "./group.model";
import { QuestionPaper } from "./question-paper.model";

export class School {
    // tslint:disable-next-line:max-line-length
    constructor(private scholId: string, private shortName: string, private fullName: string, private code: string,
        private address: Address, private contact: Contact, private board: string, private group: Group,
        private previousGroups: Group[], standard: Number[], private auxQuesPaper: QuestionPaper[],
        private createDate: Date, private lastModifiedDate: Date, private renewalDate: Date) { }

}