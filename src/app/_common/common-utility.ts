import { RoleType } from "../_models/enums";


export class CommonUtility {
    nnana: string;

    static getRoleDescription(roleType: RoleType) {
        switch (roleType) {
            case RoleType.SUPERADMIN:
                return "super-admin";

            case RoleType.GROUPADMIN:
                return "group-admin";

            case RoleType.SCHOOLADMIN:
                return "school-admin";

            case RoleType.APPROVER:
                return "approver";

            case RoleType.TEACHER:
                return "teacher";

        }
    }


}