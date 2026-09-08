/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do evento
 */
export type PutEventsIdBodyStatus =
  (typeof PutEventsIdBodyStatus)[keyof typeof PutEventsIdBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutEventsIdBodyStatus = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
