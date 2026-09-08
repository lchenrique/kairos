/**
 * type AxiosResponse<T> = T
 */

export type GetAuthInvites200ItemStatus =
  (typeof GetAuthInvites200ItemStatus)[keyof typeof GetAuthInvites200ItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthInvites200ItemStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;
