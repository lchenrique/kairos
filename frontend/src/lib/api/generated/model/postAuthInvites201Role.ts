/**
 * type AxiosResponse<T> = T
 */

export type PostAuthInvites201Role =
  (typeof PostAuthInvites201Role)[keyof typeof PostAuthInvites201Role];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthInvites201Role = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
