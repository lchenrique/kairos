/**
 * type AxiosResponse<T> = T
 */
import type { GetGroupsId200MembersItemMember } from "./getGroupsId200MembersItemMember";
import type { GetGroupsId200MembersItemRole } from "./getGroupsId200MembersItemRole";

export type GetGroupsId200MembersItem = {
  groupId: string;
  joinedAt: string;
  member: GetGroupsId200MembersItemMember;
  memberId: string;
  role: GetGroupsId200MembersItemRole;
  updatedAt: string;
};
