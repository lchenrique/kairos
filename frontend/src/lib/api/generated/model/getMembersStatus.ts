/**
 * type AxiosResponse<T> = T
 */

export type GetMembersStatus =
  (typeof GetMembersStatus)[keyof typeof GetMembersStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMembersStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
