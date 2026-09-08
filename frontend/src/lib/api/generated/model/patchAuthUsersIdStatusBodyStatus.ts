/**
 * type AxiosResponse<T> = T
 */

export type PatchAuthUsersIdStatusBodyStatus =
  (typeof PatchAuthUsersIdStatusBodyStatus)[keyof typeof PatchAuthUsersIdStatusBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchAuthUsersIdStatusBodyStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
