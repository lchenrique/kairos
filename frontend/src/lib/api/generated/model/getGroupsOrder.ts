/**
 * type AxiosResponse<T> = T
 */

export type GetGroupsOrder =
  (typeof GetGroupsOrder)[keyof typeof GetGroupsOrder];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGroupsOrder = {
  asc: "asc",
  desc: "desc",
} as const;
