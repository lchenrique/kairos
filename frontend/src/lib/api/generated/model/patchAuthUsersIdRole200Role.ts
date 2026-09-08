/**
 * type AxiosResponse<T> = T
 */

export type PatchAuthUsersIdRole200Role =
  (typeof PatchAuthUsersIdRole200Role)[keyof typeof PatchAuthUsersIdRole200Role];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchAuthUsersIdRole200Role = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
