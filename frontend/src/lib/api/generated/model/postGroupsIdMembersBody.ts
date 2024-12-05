/**
 * type AxiosResponse<T> = T
 */
import type { PostGroupsIdMembersBodyRole } from "./postGroupsIdMembersBodyRole";

export type PostGroupsIdMembersBody = {
  memberId: string;
  role?: PostGroupsIdMembersBodyRole;
};
