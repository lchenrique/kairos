/**
 * type AxiosResponse<T> = T
 */

export type PatchAuthUsersIdStatus200Status =
  (typeof PatchAuthUsersIdStatus200Status)[keyof typeof PatchAuthUsersIdStatus200Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchAuthUsersIdStatus200Status = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
