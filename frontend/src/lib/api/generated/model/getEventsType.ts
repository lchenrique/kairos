/**
 * type AxiosResponse<T> = T
 */

export type GetEventsType = (typeof GetEventsType)[keyof typeof GetEventsType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsType = {
  SERVICE: "SERVICE",
  CELL: "CELL",
  MINISTRY: "MINISTRY",
  OTHER: "OTHER",
} as const;
