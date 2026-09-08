/**
 * type AxiosResponse<T> = T
 */

/**
 * Tipo do evento
 */
export type PostEvents201Type =
  (typeof PostEvents201Type)[keyof typeof PostEvents201Type];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEvents201Type = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
