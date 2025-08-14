import type { Dict } from ".";

import {
  UserRoleEnum,
} from "./enums";

export const UserRoleDict: Dict = {
  [UserRoleEnum.SUPERADMIN]: "系统管理员",
  [UserRoleEnum.ADMIN]: "普通管理员",
  [UserRoleEnum.USER]: "用户"
};

