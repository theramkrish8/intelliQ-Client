import { Section } from './section.model';
import { QuestionCriteria } from './question-criteria.model';

export class QuestionPaper {
	constructor(private sections: Section[], private criteria: QuestionCriteria, private createDate: Date) {}
}
