/**
 * type AxiosResponse<T> = T
 */

export type PostFinance201Type =
  (typeof PostFinance201Type)[keyof typeof PostFinance201Type];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostFinance201Type = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
