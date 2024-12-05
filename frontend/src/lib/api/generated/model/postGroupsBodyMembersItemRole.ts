/**
 * type AxiosResponse<T> = T
 */

export type PostGroupsBodyMembersItemRole =
  (typeof PostGroupsBodyMembersItemRole)[keyof typeof PostGroupsBodyMembersItemRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGroupsBodyMembersItemRole = {
  LEADER: "LEADER",
  MEMBER: "MEMBER",
} as const;
