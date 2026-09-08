/**
 * type AxiosResponse<T> = T
 */

/**
 * Tipo do evento
 */
export type GetEventsId200Type =
  (typeof GetEventsId200Type)[keyof typeof GetEventsId200Type];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsId200Type = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
