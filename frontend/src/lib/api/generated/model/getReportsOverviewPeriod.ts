/**
 * type AxiosResponse<T> = T
 */

export type GetReportsOverviewPeriod =
  (typeof GetReportsOverviewPeriod)[keyof typeof GetReportsOverviewPeriod];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetReportsOverviewPeriod = {
  "30d": "30d",
  "90d": "90d",
  year: "year",
  all: "all",
} as const;
