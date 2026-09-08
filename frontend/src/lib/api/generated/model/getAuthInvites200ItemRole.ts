/**
 * type AxiosResponse<T> = T
 */

export type GetAuthInvites200ItemRole =
  (typeof GetAuthInvites200ItemRole)[keyof typeof GetAuthInvites200ItemRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthInvites200ItemRole = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
