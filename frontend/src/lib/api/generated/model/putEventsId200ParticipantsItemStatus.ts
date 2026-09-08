/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type PutEventsId200ParticipantsItemStatus =
  (typeof PutEventsId200ParticipantsItemStatus)[keyof typeof PutEventsId200ParticipantsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutEventsId200ParticipantsItemStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
