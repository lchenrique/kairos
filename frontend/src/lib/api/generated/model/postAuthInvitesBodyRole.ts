/**
 * type AxiosResponse<T> = T
 */

export type PostAuthInvitesBodyRole =
  (typeof PostAuthInvitesBodyRole)[keyof typeof PostAuthInvitesBodyRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthInvitesBodyRole = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
