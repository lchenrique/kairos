/**
 * type AxiosResponse<T> = T
 */

export type PatchAuthUsersIdRole200Status =
  (typeof PatchAuthUsersIdRole200Status)[keyof typeof PatchAuthUsersIdRole200Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchAuthUsersIdRole200Status = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
