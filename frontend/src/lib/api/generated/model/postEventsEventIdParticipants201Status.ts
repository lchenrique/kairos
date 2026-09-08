/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type PostEventsEventIdParticipants201Status =
  (typeof PostEventsEventIdParticipants201Status)[keyof typeof PostEventsEventIdParticipants201Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEventsEventIdParticipants201Status = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
