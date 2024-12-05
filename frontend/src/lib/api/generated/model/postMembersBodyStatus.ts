/**
 * type AxiosResponse<T> = T
 */

export type PostMembersBodyStatus =
  (typeof PostMembersBodyStatus)[keyof typeof PostMembersBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMembersBodyStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
