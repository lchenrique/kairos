/**
 * type AxiosResponse<T> = T
 */

export type GetFinance200DataItemType =
  (typeof GetFinance200DataItemType)[keyof typeof GetFinance200DataItemType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFinance200DataItemType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
