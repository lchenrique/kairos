/**
 * type AxiosResponse<T> = T
 */

/**
 * Tipo do evento
 */
export type GetEvents200DataItemType =
  (typeof GetEvents200DataItemType)[keyof typeof GetEvents200DataItemType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEvents200DataItemType = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
