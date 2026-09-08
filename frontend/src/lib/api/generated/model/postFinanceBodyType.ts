/**
 * type AxiosResponse<T> = T
 */

export type PostFinanceBodyType =
  (typeof PostFinanceBodyType)[keyof typeof PostFinanceBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostFinanceBodyType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
