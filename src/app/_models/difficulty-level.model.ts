import { DifficultyType } from "./enums";

export class DifficultyLevel {
    constructor(private difficulty: DifficultyType, private percent: number, private count: number) { }

}