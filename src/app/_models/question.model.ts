import { DifficultyType, LengthType, QuestionStatus } from './enums';
import { School } from './school.model';

export class Question {
	public quesId: string;
	public title: string; // chahiye
	public std: number; // chahiye
	public subject: string; // chahiye
	public topic: string; // chahiye
	public difficulty: DifficultyType; // chahiye
	public length: LengthType; // chahiye
	public status: QuestionStatus;
	public tags: string[]; // chahiye
	public category: string;
	public imageUrl: string; // chahiye
	public owner: Contributer;
	public reviewer: Contributer; // chahiye ro
	public school: School;
	public groupCode: string;
	public createDate: Date;
	public lastModifiedDate: Date;
	public rejectDesc: string;
	public originId: string;
	constructor() {}
}

export class Contributer {
	constructor(public userId: string, public userName: string) {}
}
