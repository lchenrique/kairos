/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do evento
 */
export type PostEventsBodyStatus =
  (typeof PostEventsBodyStatus)[keyof typeof PostEventsBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEventsBodyStatus = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
