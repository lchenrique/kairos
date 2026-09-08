/**
 * type AxiosResponse<T> = T
 */

export type GetFinanceType =
  (typeof GetFinanceType)[keyof typeof GetFinanceType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFinanceType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
