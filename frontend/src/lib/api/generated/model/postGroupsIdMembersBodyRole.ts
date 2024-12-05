/**
 * type AxiosResponse<T> = T
 */

export type PostGroupsIdMembersBodyRole =
  (typeof PostGroupsIdMembersBodyRole)[keyof typeof PostGroupsIdMembersBodyRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGroupsIdMembersBodyRole = {
  LEADER: "LEADER",
  MEMBER: "MEMBER",
} as const;
