/**
 * type AxiosResponse<T> = T
 */
import type { GetGroups200DataItemMembersItemMember } from "./getGroups200DataItemMembersItemMember";
import type { GetGroups200DataItemMembersItemRole } from "./getGroups200DataItemMembersItemRole";

export type GetGroups200DataItemMembersItem = {
  groupId: string;
  joinedAt: string;
  member: GetGroups200DataItemMembersItemMember;
  memberId: string;
  role: GetGroups200DataItemMembersItemRole;
  updatedAt: string;
};
