/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do evento
 */
export type GetEventsId200Status =
  (typeof GetEventsId200Status)[keyof typeof GetEventsId200Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsId200Status = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
