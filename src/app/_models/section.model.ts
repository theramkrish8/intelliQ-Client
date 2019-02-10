import { LengthType } from "./enums";
import { Question } from "./question.model";

export class Section {

    constructor(private length: LengthType, private questions: Question[], private count: number) { }

}