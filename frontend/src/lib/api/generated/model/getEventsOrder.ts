/**
 * type AxiosResponse<T> = T
 */

export type GetEventsOrder =
  (typeof GetEventsOrder)[keyof typeof GetEventsOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsOrder = {
  asc: "asc",
  desc: "desc",
} as const;
