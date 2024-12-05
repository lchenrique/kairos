/**
 * type AxiosResponse<T> = T
 */
import type { PostGroupsBodyMembersItemRole } from "./postGroupsBodyMembersItemRole";

export type PostGroupsBodyMembersItem = {
  memberId: string;
  role?: PostGroupsBodyMembersItemRole;
};
