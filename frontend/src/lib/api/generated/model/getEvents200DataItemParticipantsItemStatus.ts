/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type GetEvents200DataItemParticipantsItemStatus =
  (typeof GetEvents200DataItemParticipantsItemStatus)[keyof typeof GetEvents200DataItemParticipantsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEvents200DataItemParticipantsItemStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
