/**
 * type AxiosResponse<T> = T
 */
import type { PutGroupsId200MembersItemMember } from "./putGroupsId200MembersItemMember";
import type { PutGroupsId200MembersItemRole } from "./putGroupsId200MembersItemRole";

export type PutGroupsId200MembersItem = {
  groupId: string;
  joinedAt: string;
  member: PutGroupsId200MembersItemMember;
  memberId: string;
  role: PutGroupsId200MembersItemRole;
  updatedAt: string;
};
