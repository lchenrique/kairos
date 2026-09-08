/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type GetEventsId200ParticipantsItemStatus =
  (typeof GetEventsId200ParticipantsItemStatus)[keyof typeof GetEventsId200ParticipantsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsId200ParticipantsItemStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
