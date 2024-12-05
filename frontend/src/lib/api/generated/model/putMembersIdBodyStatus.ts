/**
 * type AxiosResponse<T> = T
 */

export type PutMembersIdBodyStatus =
  (typeof PutMembersIdBodyStatus)[keyof typeof PutMembersIdBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMembersIdBodyStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
