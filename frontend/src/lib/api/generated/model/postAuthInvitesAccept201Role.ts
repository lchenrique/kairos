/**
 * type AxiosResponse<T> = T
 */

export type PostAuthInvitesAccept201Role =
  (typeof PostAuthInvitesAccept201Role)[keyof typeof PostAuthInvitesAccept201Role];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthInvitesAccept201Role = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
