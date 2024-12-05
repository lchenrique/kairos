/**
 * type AxiosResponse<T> = T
 */

export type GetGroupsSortBy =
  (typeof GetGroupsSortBy)[keyof typeof GetGroupsSortBy];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGroupsSortBy = {
  name: "name",
  type: "type",
  createdAt: "createdAt",
} as const;
