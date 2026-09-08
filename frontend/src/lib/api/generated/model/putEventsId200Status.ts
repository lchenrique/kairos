/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do evento
 */
export type PutEventsId200Status =
  (typeof PutEventsId200Status)[keyof typeof PutEventsId200Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutEventsId200Status = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
