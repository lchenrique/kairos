/**
 * type AxiosResponse<T> = T
 */

export type PutFinanceIdBodyType =
  (typeof PutFinanceIdBodyType)[keyof typeof PutFinanceIdBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutFinanceIdBodyType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
