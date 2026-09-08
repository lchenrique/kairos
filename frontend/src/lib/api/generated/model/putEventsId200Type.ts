/**
 * type AxiosResponse<T> = T
 */

/**
 * Tipo do evento
 */
export type PutEventsId200Type =
  (typeof PutEventsId200Type)[keyof typeof PutEventsId200Type];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutEventsId200Type = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
