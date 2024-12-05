/**
 * type AxiosResponse<T> = T
 */

export type GetMembersSortBy =
  (typeof GetMembersSortBy)[keyof typeof GetMembersSortBy];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMembersSortBy = {
  name: "name",
  email: "email",
  createdAt: "createdAt",
} as const;
