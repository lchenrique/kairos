/**
 * type AxiosResponse<T> = T
 */
import type { PostGroupsIdMembers201Member } from "./postGroupsIdMembers201Member";
import type { PostGroupsIdMembers201Role } from "./postGroupsIdMembers201Role";

export type PostGroupsIdMembers201 = {
  groupId: string;
  joinedAt: string;
  member: PostGroupsIdMembers201Member;
  memberId: string;
  role: PostGroupsIdMembers201Role;
  updatedAt: string;
};
