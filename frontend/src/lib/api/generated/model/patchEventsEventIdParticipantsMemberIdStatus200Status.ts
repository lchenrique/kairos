/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type PatchEventsEventIdParticipantsMemberIdStatus200Status =
  (typeof PatchEventsEventIdParticipantsMemberIdStatus200Status)[keyof typeof PatchEventsEventIdParticipantsMemberIdStatus200Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PatchEventsEventIdParticipantsMemberIdStatus200Status = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
