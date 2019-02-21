import { QuestionType } from './question-type.model';
import { DifficultyLevel } from './difficulty-level.model';

export class QuestionCriteria {
	constructor(
		private std: number,
		private subject: string,
		private topics: string[],
		private questionType: QuestionType,
		private sets: number,
		private difficulty: DifficultyLevel,
		private quesColName: string,
		private tags: string[]
	) {}
}
