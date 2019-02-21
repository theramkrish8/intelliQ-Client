import { DifficultyType, LengthType } from './enums';
import { School } from './school.model';
import { Group } from './group.model';

export class Question {
	// tslint:disable-next-line:max-line-length
	constructor(
		public questionId: string,
		public title: string,
		public description: string,
		public subject: string,
		public std: number,
		public owner: string,
		public approver: string,
		public topic: string,
		public dissiculty: DifficultyType,
		public length: LengthType,
		public tags: string[],
		public category: string,
		public school: School,
		public group: Group,
		public createDate: Date,
		public imageUrl: string,
		public newTopic: boolean
	) {}
}
