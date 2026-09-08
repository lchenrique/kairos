/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type PostEventsEventIdParticipantsBodyStatus =
  (typeof PostEventsEventIdParticipantsBodyStatus)[keyof typeof PostEventsEventIdParticipantsBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEventsEventIdParticipantsBodyStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
