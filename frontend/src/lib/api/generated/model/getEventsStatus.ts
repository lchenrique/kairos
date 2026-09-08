/**
 * type AxiosResponse<T> = T
 */

export type GetEventsStatus =
  (typeof GetEventsStatus)[keyof typeof GetEventsStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsStatus = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
