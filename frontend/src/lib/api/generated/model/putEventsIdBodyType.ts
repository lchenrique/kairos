/**
 * type AxiosResponse<T> = T
 */

/**
 * Tipo do evento
 */
export type PutEventsIdBodyType =
  (typeof PutEventsIdBodyType)[keyof typeof PutEventsIdBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutEventsIdBodyType = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
