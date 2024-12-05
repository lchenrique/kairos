/**
 * type AxiosResponse<T> = T
 */
import type { PostGroups201MembersItemMember } from "./postGroups201MembersItemMember";
import type { PostGroups201MembersItemRole } from "./postGroups201MembersItemRole";

export type PostGroups201MembersItem = {
  groupId: string;
  joinedAt: string;
  member: PostGroups201MembersItemMember;
  memberId: string;
  role: PostGroups201MembersItemRole;
  updatedAt: string;
};
