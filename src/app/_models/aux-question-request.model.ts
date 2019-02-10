import { Group } from "./group.model";

export class AuxQuestionRequest {

    constructor(private group: Group, private schoolId: string,
        private teacherId: string, private approverId: string, private auxQuestionId: string) { }

}