/**
 * type AxiosResponse<T> = T
 */

export type GetReportsOverview200PeriodKey =
  (typeof GetReportsOverview200PeriodKey)[keyof typeof GetReportsOverview200PeriodKey];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetReportsOverview200PeriodKey = {
  "30d": "30d",
  "90d": "90d",
  year: "year",
  all: "all",
} as const;
