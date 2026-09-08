/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do evento
 */
export type GetEvents200DataItemStatus =
  (typeof GetEvents200DataItemStatus)[keyof typeof GetEvents200DataItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEvents200DataItemStatus = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
