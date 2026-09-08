/**
 * type AxiosResponse<T> = T
 */

export type GetAuthUsers200ItemStatus =
  (typeof GetAuthUsers200ItemStatus)[keyof typeof GetAuthUsers200ItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthUsers200ItemStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
