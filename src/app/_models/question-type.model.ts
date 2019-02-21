import { LengthType } from './enums';

export class QuestionType {
	constructor(private length: LengthType, private cout: number, private marks: number) {}
}
