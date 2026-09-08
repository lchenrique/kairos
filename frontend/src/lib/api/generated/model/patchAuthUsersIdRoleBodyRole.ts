/**
 * type AxiosResponse<T> = T
 */

export type PatchAuthUsersIdRoleBodyRole =
  (typeof PatchAuthUsersIdRoleBodyRole)[keyof typeof PatchAuthUsersIdRoleBodyRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchAuthUsersIdRoleBodyRole = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
