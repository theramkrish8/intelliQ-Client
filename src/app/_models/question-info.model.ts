import { QuestionType } from './question-type.model';
import { DifficultyLevel } from './difficulty-level.model';

export class QuestionInfo {
	constructor(private sectionType: QuestionType, private difficulty: DifficultyLevel) {}
}
