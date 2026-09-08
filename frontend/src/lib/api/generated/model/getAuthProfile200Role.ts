/**
 * type AxiosResponse<T> = T
 */

export type GetAuthProfile200Role =
  (typeof GetAuthProfile200Role)[keyof typeof GetAuthProfile200Role];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthProfile200Role = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
