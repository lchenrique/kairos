/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do evento
 */
export type PostEvents201Status =
  (typeof PostEvents201Status)[keyof typeof PostEvents201Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEvents201Status = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
