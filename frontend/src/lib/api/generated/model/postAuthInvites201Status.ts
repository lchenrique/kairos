/**
 * type AxiosResponse<T> = T
 */

export type PostAuthInvites201Status =
  (typeof PostAuthInvites201Status)[keyof typeof PostAuthInvites201Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthInvites201Status = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;
