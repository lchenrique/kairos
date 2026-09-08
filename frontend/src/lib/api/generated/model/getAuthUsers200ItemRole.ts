/**
 * type AxiosResponse<T> = T
 */

export type GetAuthUsers200ItemRole =
  (typeof GetAuthUsers200ItemRole)[keyof typeof GetAuthUsers200ItemRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthUsers200ItemRole = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
