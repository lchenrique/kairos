/**
 * type AxiosResponse<T> = T
 */

/**
 * Status do participante
 */
export type PostEvents201ParticipantsItemStatus =
  (typeof PostEvents201ParticipantsItemStatus)[keyof typeof PostEvents201ParticipantsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEvents201ParticipantsItemStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
