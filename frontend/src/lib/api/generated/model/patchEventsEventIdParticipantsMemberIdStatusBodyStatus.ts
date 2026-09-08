/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type PatchEventsEventIdParticipantsMemberIdStatusBodyStatus =
  (typeof PatchEventsEventIdParticipantsMemberIdStatusBodyStatus)[keyof typeof PatchEventsEventIdParticipantsMemberIdStatusBodyStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchEventsEventIdParticipantsMemberIdStatusBodyStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
