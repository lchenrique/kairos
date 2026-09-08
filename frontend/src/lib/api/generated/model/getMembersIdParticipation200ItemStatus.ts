/**
 * type AxiosResponse<T> = T
 */

export type GetMembersIdParticipation200ItemStatus =
  (typeof GetMembersIdParticipation200ItemStatus)[keyof typeof GetMembersIdParticipation200ItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMembersIdParticipation200ItemStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
