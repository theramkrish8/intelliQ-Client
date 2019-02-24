import { Address } from './address.model';
import { Contact } from './contact.model';
import { Group } from './group.model';
import { QuestionPaper } from './question-paper.model';

export class School {
	public schoolId: string;
	public shortName: string;
	public fullName: string;
	public code: string;
	public address: Address;
	public contact: Contact;
	public board: string;
	public group: Group;
	public prevGroups: Group[];
	public stds: Number[];
	public auxQuesPaper: QuestionPaper[];
	public createDate: Date;
	public lastModifiedDate: Date;
	public renewalDate: Date;

	constructor() {}
}
