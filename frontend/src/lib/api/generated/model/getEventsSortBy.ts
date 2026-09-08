/**
 * type AxiosResponse<T> = T
 */

export type GetEventsSortBy =
  (typeof GetEventsSortBy)[keyof typeof GetEventsSortBy];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsSortBy = {
  title: "title",
  startDate: "startDate",
  type: "type",
  createdAt: "createdAt",
} as const;
