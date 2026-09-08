/**
 * type AxiosResponse<T> = T
 */

/**
 * Tipo do evento
 */
export type PostEventsBodyType =
  (typeof PostEventsBodyType)[keyof typeof PostEventsBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEventsBodyType = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
