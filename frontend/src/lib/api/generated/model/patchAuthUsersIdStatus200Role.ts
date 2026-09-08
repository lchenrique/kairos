/**
 * type AxiosResponse<T> = T
 */

export type PatchAuthUsersIdStatus200Role =
  (typeof PatchAuthUsersIdStatus200Role)[keyof typeof PatchAuthUsersIdStatus200Role];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchAuthUsersIdStatus200Role = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
